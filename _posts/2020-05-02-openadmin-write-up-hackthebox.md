---
layout: single
title: "OpenAdmin Write-Up: HackTheBox"
excerpt: "OpenAdmin was a fun, easy machine with an interesting internal web application."
classes: wide
categories: [hackthebox]
date: 2020-05-02
tags: [hackthebox, hacking, penetration testing, write-ups]
header:
  teaser: \assets\images\htb\openadmin\banner-openadmin.png
  teaser_home_page: true
toc: true
toc_label: "Table of Contents"
toc_icon: "book-dead"  # corresponding Font Awesome icon name (without fa prefix)
# toc_sticky: true
---
![](\assets\images\htb\openadmin\banner-openadmin.png)
## TL;DR
OpenAdmin was a fun, easy machine with an interesting internal web application. With only two open ports, SSH (22) and HTTP (80) the attack surface is minimal. Web enumeration revealed a few web applications, one being an outdated OpenNetAdmin IP Address Management (IPAM) system (v18.1.1), which allowed RCE as the www-data user. Once we obtained a shell, system enumeration revealed stored credentials which allowed us to pivot via SSH to another user (Jimmy) and capture the user flag. The Jimmy user was also part of a unique group that allowed us access to an internal web application that output the SSH private key (encrypted, but easily cracked) to another user (Joanna). Joanna had sudo privileges to run Nano, which using the help of GTFOBins, gave us a root shell.

## Nmap Port Scan
Looking at the scan, we see a couple of ports open.

```bash
nmap -sCV -p- -oN nmap/openadmin-full 10.10.10.171
```
```bash
Nmap scan report for 10.10.10.171
Host is up (0.023s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 4b:98:df:85:d1:7e:f0:3d:da:48:cd:bc:92:00:b7:54 (RSA)
|   256 dc:eb:3d:c9:44:d1:18:b1:22:b4:cf:de:bd:6c:7a:54 (ECDSA)
|_  256 dc:ad:ca:3c:11:31:5b:6f:e6:a4:89:34:7c:9b:e5:50 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 24.86 seconds
```

## Web Enumeration
Directory brute-forcing revealed several directories.

Command Used: `rustbuster dir -u http://10.10.10.171 -w /opt/SecLists/Discovery/Web-Content/common.txt -t 25`
![](\assets\images\htb\openadmin\rustbuster-openadmin.png)

`http://10.10.10.171/music/` Clicking Login, takes us to an ONA interface.
![](\assets\images\htb\openadmin\musicweb-openadmin.png)

OpenNetAdmin IP Address Management (IPAM) system
`http://10.10.10.171/ona/`
![](\assets\images\htb\openadmin\ona-openadmin.png)

## OpenNetAdmin Exploitation

Searchsploit revealed a couple of exploits for the version, one with Metasploit and one without. 
![](\assets\images\htb\openadmin\search-openadmin.png)

Copying the bash script directly from searchsploit left a few random carriage returns, etc., so the script needed a little cleanup. But after being cleaned up, it worked and we have a rudimentary shell as www-data.
![](\assets\images\htb\openadmin\exploit-openadmin.png)

I uploaded, upgraded and executed a proper php shell. 
![](\assets\images\htb\openadmin\phpshell-openadmin.png)

{% gist 32cc7df561b8076201312e4fc5294f14 %}

Time to enumerate! Quick hits with some grepping came up with:
![](\assets\images\htb\openadmin\database_settings-openadmin.png)

Command used:  `egrep -R 'password|pass'`

```php
<?php

$ona_contexts=array (
  'DEFAULT' => 
  array (
    'databases' => 
    array (
      0 => 
      array (
        'db_type' => 'mysqli',
        'db_host' => 'localhost',
        'db_login' => 'ona_sys',
        'db_passwd' => 'n1nj4W4rri0R!',
        'db_database' => 'ona_default',
        'db_debug' => false,
      ),
    ),
    'description' => 'Default data context',
    'context_color' => '#D3DBFF',
  ),
);

?>
```

Enumerating the database gives some hashes.
![](\assets\images\htb\openadmin\OpenAdmin-HTB.gif)

The hashes were essentially useless. But we have another way! A quick look at `/etc/passwd` reveals two regular users: jimmy & joanna. A quick try with jimmy and the `n1nj4W4rri0R!` password gets us a SSH session and some interesting finds with LinPEAS!
![](\assets\images\htb\openadmin\linpeas1-openadmin.png)
![](\assets\images\htb\openadmin\linpeas2-openadmin.png)
![](\assets\images\htb\openadmin\linpeas3-openadmin.png)

So it appears our friend Jimmy (and Joanna) is in an `internal` group which has write access to "/var/www/internal". A quick telnet/curl to the unusual port reveals it is an Apache service hosting `internal.openadmin.htb`. Putting two and two together, it is probably serving the internal directory. Let's check out that directory.

Well, it appears we can get Joanna's SSH private key:
main.php 
```
<?php session_start(); if (!isset ($_SESSION['username'])) { header("Location: /index.php"); }; 
# Open Admin Trusted
# OpenAdmin
$output = shell_exec('cat /home/joanna/.ssh/id_rsa');
echo "<pre>$output</pre>";
?>
<html>
<h3>Don't forget your "ninja" password</h3>
Click here to logout <a href="logout.php" tite = "Logout">Session
</html>
```

Easy enough.
![](\assets\images\htb\openadmin\joannakey-openadmin.png)

It's encrypted, so we use:

`/usr/share/john/ssh2john.py joanna.key > joanna.hash`

`john joanna.hash --wordlist=/usr/share/wordlists/rockyou.txt`

John made quick work of it, even in a VM.
![](\assets\images\htb\openadmin\john-openadmin.png)

We get in and capture user.txt.
![](\assets\images\htb\openadmin\user-openadmin.png)

Interesting sudo finding:
![](\assets\images\htb\openadmin\sudo-openadmin.png)

GTFOBins shows us we can get a shell with Nano, let's try it.
![](\assets\images\htb\openadmin\sudo_gtfobins-openadmin.png)

`sudo /bin/nano /opt/priv`
![](\assets\images\htb\openadmin\root-openadmin.png)

Got Root!