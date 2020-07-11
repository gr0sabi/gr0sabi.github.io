var store = [{
        "title": "OSCP: Insights, Best Practices, and Resources",
        "excerpt":"Purpose I wrote this post to give back some of the insights I’ve discovered on my journey to becoming an OSCP. It will cover personal insights, resources, and best practices. There is a lot of great information available on the Internet so I will make an honest effort not to...","categories": ["certification"],
        "tags": ["oscp","hacking","penetration testing","offensive security","certification"],
        "url": "http://localhost:4000/certification/oscp-insights-best-practices-resources/",
        "teaser": "http://localhost:4000/assets/images/oscp-post/offsec-oscp.png"
      },{
        "title": "CISSP After-Action Report",
        "excerpt":"TL;DR On 18 February 2020, I “provisionally passed” the CISSP examination on my first attempt at 100 questions with self-study. I’m writing this post to give back to the community some of my study practices that allowed me to conquer this beast of an exam. The r/CISSP Reddit Community was...","categories": ["certification"],
        "tags": ["cissp","certification","study advice","best practices"],
        "url": "http://localhost:4000/certification/cissp-after-action-report/",
        "teaser": "http://localhost:4000/assets/images/cissp-post/CISSP.png"
      },{
        "title": "Cascade Write-Up: HackTheBox",
        "excerpt":"TL;DR Cascade is a well-made, straight-forward machine that is a fun enumeration exercise and requires a bit of .NET debugging. Port enumeration reveals an open LDAP service that is used to dump user objects. One user (Ryan Thompson) has a custom attribute (cascadeLegacyPwd) that reveals a Base64-encoded password which allows...","categories": ["hackthebox"],
        "tags": ["hackthebox","hacking","penetration testing","write-ups"],
        "url": "http://localhost:4000/hackthebox/cascade-write-up-hackthebox/",
        "teaser": "http://localhost:4000/%5Cassets%5Cimages%5Chtb%5Ccascade%5Ccascade-banner.png"
      },{
        "title": "Remote Write-Up: HackTheBox",
        "excerpt":"TL;DR Remote was a Windows-based, easy level challenge from mrb3n on HackTheBox that had a cool privilege escalation. The initial Nmap scan showed multiple interesting ports - FTP with anonymous login, web server on port 80, SMB on 445 and a open NFS share. I started by connecting to FTP...","categories": ["hackthebox"],
        "tags": ["hackthebox","hacking","penetration testing","write-ups","CVE","windows"],
        "url": "http://localhost:4000/hackthebox/remote-write-up-hackthebox/",
        "teaser": "http://localhost:4000/%5Cassets%5Cimages%5Chtb%5Cremote%5Cbanner-remote.png"
      },{
        "title": "Traceback Write-Up - HackTheBox",
        "excerpt":"Summary Traceback was an easy-rated, Linux machine made by Xh4H on HackTheBox that allowed some Lua interaction and unique escalation of privileges. The port scan showed SSH and an Apache server running on port 80. Looking at the web server, it showed a compromised web page with an interesting comment...","categories": ["hackthebox"],
        "tags": ["hackthebox","hacking","penetration testing","write-ups","linux"],
        "url": "http://localhost:4000/hackthebox/traceback-write-up-hackthebox/",
        "teaser": "http://localhost:4000/%5Cassets%5Cimages%5Chtb%5Ctraceback%5Cbanner-traceback.png"
      },{
        "title": "OpenAdmin Write-Up: HackTheBox",
        "excerpt":"TL;DR OpenAdmin was a fun, easy machine with an interesting internal web application. With only two open ports, SSH (22) and HTTP (80) the attack surface is minimal. Web enumeration revealed a few web applications, one being an outdated OpenNetAdmin IP Address Management (IPAM) system (v18.1.1), which allowed RCE as...","categories": ["hackthebox"],
        "tags": ["hackthebox","hacking","penetration testing","write-ups"],
        "url": "http://localhost:4000/hackthebox/openadmin-write-up-hackthebox/",
        "teaser": "http://localhost:4000/%5Cassets%5Cimages%5Chtb%5Copenadmin%5Cbanner-openadmin.png"
      },{
        "title": "Obscurity Write-Up: HackTheBox",
        "excerpt":"TL;DR Obscurity was a fantastic machine of medium difficulty by clubby789 at HackTheBox. Rolling a few custom Python scripts for a web service, encryption, and SSH, Obscurity gave a couple of holes that I could squeeze through. With only a couple of open ports, it led me straight to enumerating...","categories": ["hackthebox"],
        "tags": ["hackthebox","reversing","python","penetration testing","write-ups"],
        "url": "http://localhost:4000/hackthebox/obscurity-write-up-hackthebox/",
        "teaser": "http://localhost:4000/%5Cassets%5Cimages%5Chtb%5Cobscurity%5Cbanner-obscurity.png"
      },{
        "title": "Book Write-Up: HackTheBox",
        "excerpt":"TL;DR Book was a medium machine on Hack The Box created by MrR3boot. Initial recon revealed a web application whose user registration is vulnerable to a SQL truncation attack, leading to login as admin. Once admin, we can inject XSS payloads to read local files through dynamically generated PDFs, which...","categories": ["hackthebox"],
        "tags": ["hackthebox","xxs","sqli","hacking","penetration testing","write-ups"],
        "url": "http://localhost:4000/hackthebox/book-write-up-hack-the-box/",
        "teaser": "http://localhost:4000/%5Cassets%5Cimages%5Chtb%5Cbook%5Cbook-banner.png"
      }]
