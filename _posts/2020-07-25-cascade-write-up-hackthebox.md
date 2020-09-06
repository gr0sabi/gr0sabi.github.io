---
layout: single
title:  "Cascade Write-Up: HackTheBox"
excerpt: "Cascade is a well-made, straight-forward machine that is a fun enumeration exercise and requires a bit of .NET debugging."
classes: wide
categories: [hackthebox]
date: 2020-07-25
tags: [hackthebox, hacking, penetration testing, write-ups]
header:
  teaser: \assets\images\htb\cascade\cascade-banner.png
  teaser_home_page: true
toc: true
toc_label: "Table of Contents"
toc_icon: "database"  # corresponding Font Awesome icon name (without fa prefix)
# toc_sticky: true
---
![](\assets\images\htb\cascade\cascade-banner.png)
## TL;DR
Cascade is a well-made, straight-forward machine that is a fun enumeration exercise and requires a bit of .NET debugging. Port enumeration reveals an open LDAP service that is used to dump user objects. One user (Ryan Thompson) has a custom attribute (cascadeLegacyPwd) that reveals a Base64-encoded password which allows SMB authentication to read a shared folder (Data). Within the shared folder a VNC registry file leaks the encrypted password of another user (s.smith) which (once unecrypted) the user access to read a different SMB share (Audit$). Within the new shared folder, an insecurely written .NET application can be obtained and debugged to decrypt the password of a custom service user (ArkSvc). With the custom service user (ArkSvc), a deleted Active Directory object of a temporary admin account with the same custom attribute (cascadeLegacyPwd) can be obtained. This attribute can be decoded and is an identical (reused) password to the Administrator account.

## Nmap Port Scan
```bash
nmap -sCV -p- -oN nmap/cascade-full 10.10.10.182
```
```bash
Starting Nmap 7.80 ( https://nmap.org ) at 2020-03-31 19:27 EDT
Nmap scan report for 10.10.10.182
Host is up (0.023s latency).
Not shown: 65520 filtered ports
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Microsoft DNS 6.1.7601 (1DB15D39) (Windows Server 2008 R2 SP1)
| dns-nsid: 
|_  bind.version: Microsoft DNS 6.1.7601 (1DB15D39)
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2020-03-31 23:32:04Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: cascade.local, Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: cascade.local, Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49154/tcp open  msrpc         Microsoft Windows RPC
49155/tcp open  msrpc         Microsoft Windows RPC
49157/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49158/tcp open  msrpc         Microsoft Windows RPC
49165/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: CASC-DC1; OS: Windows; CPE: cpe:/o:microsoft:windows_server_2008:r2:sp1, cpe:/o:microsoft:windows

Host script results:
|_clock-skew: 2m49s
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2020-03-31T23:32:53
|_  start_date: 2020-03-31T21:10:59
```

## LDAP Enumeration

Enumerating LDAP we see an interesting attribute `cascadeLegacyPwd`. The Base64 value decodes to what appears to be a password `rY4n5eva`. 
![](\assets\images\htb\cascade\cacade-ryan-user-object.png)

Commands Utilized:
```bash
ldapsearch -h 10.10.10.182 -x -s base namingcontexts
ldapsearch -h 10.10.10.182 -x -b "DC=cascade,DC=local" > ldap-out.txt
ldapsearch -h 10.10.10.182 -x -b "DC=cascade,DC=local" '(objectClass=Person)' > ldap-object-person.txt
```
## SMB Enumeration

Our new friend Ryan can read some interesting an interesting share called `Data`.
![](\assets\images\htb\cascade\cacade-ryan-smb1.png)

Let's see what's inside.
![](\assets\images\htb\cascade\cacade-ryan-smb2.png)

This data looks worthwhile. Let's mount it to get a closer look at these files.
```bash
mount -t cifs -o username=r.thompson //10.10.10.182/Data /mnt/smb-data/
```

Three files really stood out to me. The first is the meeting notes, which make a point to let us know about a TempAdmin account that has the same password as the normal admin account.
![](\assets\images\htb\cascade\meeting-notes-html.png)

This next file is interesting. It shows the ArkSvc user running an application that shows the deletion the TempAdmin account (mentioned in the above "Meeting Notes") with object location.
![](\assets\images\htb\cascade\ark-log.png)

The last interesting file, VNC Install.reg, in s.smith's directory, contained the VNC encrypted password:
```
...
"Password"=hex:6b,cf,2a,4b,6e,5a,ca,0f
...
```

Using this tool https://github.com/trinitronx/vncpasswd.py it was successfully decrypted and appears we have another password:
![](\assets\images\htb\cascade\vcnpass.png)

Continuing my SMB enumeration, s.smith had access to Read the Audit$ share, so I mounted it to get a good look at the files.
![](\assets\images\htb\cascade\audit-share-view.png)

I took a quick glance at the Audit.db file, looks like we have a winner.
![](\assets\images\htb\cascade\sqlite-db.png) 

### dnSpy to the Rescue
Transferred over the files application to a Windows machine, utlizing dnSpy I was able to set a breakpoint in the application to decrypt the password of ArkSvc user: `w3lc0meFr31nd`
![](\assets\images\htb\cascade\Cascade-HTB.gif)

## Shells

### User Flag
Satisfied with SMB enumeration of the files, I utilized Evil-WinRM to login with s.smith user and capture the user flag.
![](\assets\images\htb\cascade\user-flag.png)

Repeated the use of Evil-WinRM to login with ArkSvc user.
![](\assets\images\htb\cascade\arkscv-login.png)

Viewing Groups it appears that ArkSvc has a unique group.
![](\assets\images\htb\cascade\arksvc-group.png)

Let's check on that deleted TempAdmin account. Yep! Gone, but not forgotten.
![](\assets\images\htb\cascade\temp-admin-enum.png)

Viewed the properties and noticed our old friend cascadeLegacyPwd.
![](\assets\images\htb\cascade\property-dump.png)

Primary Commands Utilized:
```powershell
Get-ADPrincipalGroupMembership -Identity arksvc
Get-ADObject -Identity "CN=TempAdmin\0ADEL:f0cc344d-31e0-4866-bceb-a842791ca059,CN=Deleted Objects,DC=cascade,DC=local" -IncludeDeletedObjects
Get-ADObject -Identity "CN=TempAdmin\0ADEL:f0cc344d-31e0-4866-bceb-a842791ca059,CN=Deleted Objects,DC=cascade,DC=local" -IncludeDeletedObjects -Properties *
```

### Root Flag

The decoded base64 of the cascadeLegacyPwd is `baCT3r1aN00dles` and immediately worked with the Administrator account to capture the root flag.
![](\assets\images\htb\cascade\root-flag.png)