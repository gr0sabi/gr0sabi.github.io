---
layout: single
title: 'Nest Write-Up: Hack The Box'
excerpt: "Nest was an excellent *easy*-rated machine on Hack The Box created by VbScrub. Initial recon revealed an open SMB port and an uncommon HQK Reporting service. Enumerating SMB revealed some default credentials, which allowed further read access. Digging further we come across some encrypted credentials and a Visual Basic project. Building the project we are able to decrypt yet another password, but this time for an user `c.smith`. We use the new found creds to go further into the SMB gauntlet and discover the HQK Reporting binary. Tearing it apart with dnSpy, and a touch of reversing, we get the Administrator password and root flag."
classes: wide
categories: [hackthebox]
date: 2020-06-06
tags: [hackthebox, smb, dnspy, penetration testing, write-ups]
header:
  teaser: \assets\images\htb\nest\nest-banner.png
  teaser_home_page: true
toc: false
toc_label: "Table of Contents"
toc_icon: "database"  # corresponding Font Awesome icon name (without fa prefix)
toc_sticky: false
---
![](\assets\images\htb\nest\nest-banner.png)
## TL;DR
Nest was an excellent *easy*-rated machine on Hack The Box created by VbScrub. Initial recon revealed an open SMB port and an uncommon HQK Reporting service. Enumerating SMB revealed some default credentials, which allowed further read access. Digging further we come across some encrypted credentials and a Visual Basic project. Building the project we are able to decrypt yet another password, but this time for an user `c.smith`. We use the new found creds to go further into the SMB gauntlet and discover the HQK Reporting binary. Tearing it apart with dnSpy, and a touch of reversing, we get the Administrator password and root flag.

## Nmap Port Scan
`nmap -sCV -Pn -n -p- -T4 -oN nmap/full-nest 10.10.10.178`
```
Nmap scan report for 10.10.10.178                                                                                    
Host is up (0.024s latency).                                                                                         
Not shown: 65533 filtered ports                                                                                      
PORT     STATE SERVICE       VERSION                                                                                 
445/tcp  open  microsoft-ds?                                                                                         
4386/tcp open  unknown                                                                                               
| fingerprint-strings:                                                                                               
|   DNSStatusRequestTCP, DNSVersionBindReqTCP, Kerberos, LANDesk-RC, LDAPBindReq, LDAPSearchReq, LPDString, NULL, RPCCheck, SMBProgNeg, SSLSessionReq, TLSSessionReq, TerminalServer, TerminalServerCookie, X11Probe: 
|     Reporting Service V1.2                                                                                         
|   FourOhFourRequest, GenericLines, GetRequest, HTTPOptions, RTSPRequest, SIPOptions: 
|     Reporting Service V1.2
|     Unrecognised command
|   Help:          
|     Reporting Service V1.2
|     This service allows users to run queries against databases using the legacy HQK format
|     AVAILABLE COMMANDS ---                  
|     LIST   
|     SETDIR <Directory_Name>
|     RUNQUERY <Query_ID>          
|     DEBUG <Password>
|_    HELP <Command> 

Host script results:
|_clock-skew: 1m02s
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2020-04-23T15:52:23
|_  start_date: 2020-04-22T20:12:01
```

## Initial Enumeration
With only two open ports, I chose to look at the uncommon service running on port 4386. Telneting in `HQK Reporting Service V1.2` is displayed, with a prompt. Typing `help` shows various commands. I'm sure I will have to dig into this more later.
![](\assets\images\htb\nest\nest-telnet.png)

## SMB Enumeration
![](\assets\images\htb\nest\nest-smbclient.png)

Exploring the shares on SMB to see what could be accessed and I found that only the `Data` share had a couple of readable files.
`Maintenance Alerts.txt`  
![](\assets\images\htb\nest\nest-maint.png)

We have some creds.  
`Welcome Email.txt`  
![](\assets\images\htb\nest\nest-welcome.png)

## Further Data Share Enumeration
![](\assets\images\htb\nest\nest-smbmap.png)

To begin enumeration I recursively listed the Data share to learn that I had read access to various *new* files.

```
.\Data\IT\Configs\Adobe\*     
dr--r--r--                0 Wed Aug  7 15:20:13 2019    .
dr--r--r--                0 Wed Aug  7 15:20:13 2019    ..
fr--r--r--              246 Wed Aug  7 15:20:13 2019    editing.xml
fr--r--r--                0 Wed Aug  7 15:20:09 2019    Options.txt
fr--r--r--              258 Wed Aug  7 15:20:09 2019    projects.xml
fr--r--r--             1274 Wed Aug  7 15:20:09 2019    settings.xml
.\Data\IT\Configs\Atlas\*
dr--r--r--                0 Tue Aug  6 07:16:34 2019    .
dr--r--r--                0 Tue Aug  6 07:16:34 2019    ..
fr--r--r--             1369 Tue Aug  6 07:18:38 2019    Temp.XML
.\Data\IT\Configs\Microsoft\*
dr--r--r--                0 Wed Aug  7 15:23:26 2019    .
dr--r--r--                0 Wed Aug  7 15:23:26 2019    ..
fr--r--r--             4598 Wed Aug  7 15:23:26 2019    Options.xml
.\Data\IT\Configs\NotepadPlusPlus\*
dr--r--r--                0 Wed Aug  7 15:33:54 2019    .
dr--r--r--                0 Wed Aug  7 15:33:54 2019    ..
fr--r--r--             6451 Wed Aug  7 19:01:25 2019    config.xml
fr--r--r--             2108 Wed Aug  7 19:00:36 2019    shortcuts.xml
.\Data\IT\Configs\RU Scanner\*
dr--r--r--                0 Wed Aug  7 16:01:13 2019    .
dr--r--r--                0 Wed Aug  7 16:01:13 2019    ..
fr--r--r--              270 Thu Aug  8 15:49:37 2019    RU_config.xml
```

I used `smbget -Rrv  smb://10.10.10.178/Data/ -U TempUser` to snag all the files locally.

`Data\IT\Configs\NotepadPlusPlus\config.xml` contained an interesting path:

```
<File filename="C:\windows\System32\drivers\etc\hosts" />
<File filename="\\HTB-NEST\Secure$\IT\Carl\Temp.txt" />
<File filename="C:\Users\C.Smith\Desktop\todo.txt" />
```

I found a username and password entry in `Data\IT\Configs\RU Scanner\RU_config.xml` and attempted a login, but it appears the password is encrypted when I decoded it.
![](\assets\images\htb\nest\nest-ru-config.png)

Taking a look at the newly discovered path (Secure$\IT\Carl\) at the Secure$ share, I used smbclient to uncover a trove of files in Carl's directory. Particularly interesting is the RUScanner files, which appear to be a Visual Basic project!
![](\assets\images\htb\nest\nest-carl.png)

I'll use smbget again to snag a copy of all the files locally to examine then more closely.
![](\assets\images\htb\nest\nest-smbget.png)

Within Utils.vb there is a decrypt function:
![](\assets\images\htb\nest\nest-decrypt.png)

With this information, I decided to build out a simple project in Visual Studio. Basically I combined all the key classes from Carl's RUScanner and I added a few lines to print the decrypted password to the console.
![](\assets\images\htb\nest\nest-studio.png)

This gave us the password from the RU_Config.xml I found earlier. 
`xRxRxPANCAK3SxRxRx`

Using it to access the Users share we got the user flag, an executable and various files related to the other port from earlier - HQK Reporting.
![](\assets\images\htb\nest\nest-smith.png)

The "Debug Mode Password.txt" showed a size of 0 and I thought that was peculiar, and it turned out it had an alternate data stream, so I grabbed it.
![](\assets\images\htb\nest\nest-stream.png)

![](\assets\images\htb\nest\nest-file.png)

I used the Debug Mode Password within a telnet session with the HQK Reporting service and found what appears to be an ldap configuration file. I attempted to use the password "as is" in various capacities, but that returned nothing. B64 decoded, it appears as an encrypted value. Let's move on the binary. 
![](\assets\images\htb\nest\nest-HQK.png)

Using dnSpy, Taking a look at the HqkLdap.exe binary, we see some interesting functions.
![](\assets\images\htb\nest\nest-dnspy.png)

I locally created the Ldap.conf (with the file found from earlier). I also had to create an empty `HqkDbImport.exe` file because the binary checks for the existence of it. I set a breakpoint within the Main function for when after the LDAP password is decrypted and we see the decrypted value when it gets returned. `XtH4nkS4Pl4y1nGX`
![](\assets\images\htb\nest\nest-dnspy-pass.png)

I used the password with the Administrator account to access the C$ share with `smbclient` and was able to obtain the root flag. Thanks for reading!
![](\assets\images\htb\nest\nest-root.png)