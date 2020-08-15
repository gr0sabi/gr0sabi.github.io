var store = [{
        "title": "OSCP: Insights, Best Practices, and Resources",
        "excerpt":"Purpose I wrote this post to give back some of the insights I’ve discovered on my journey to becoming an OSCP. It will cover personal insights, resources, and best practices. There is a lot of great information available on the Internet so I will make an honest effort not to...","categories": ["certification"],
        "tags": ["oscp","hacking","penetration testing","offensive security","certification"],
        "url": "https://gr0sabi.github.io/certification/oscp-insights-best-practices-resources/",
        "teaser": "https://gr0sabi.github.io/assets/images/oscp-post/offsec-oscp.png"
      },{
        "title": "CISSP After-Action Report",
        "excerpt":"TL;DR On 18 February 2020, I “provisionally passed” the CISSP examination on my first attempt at 100 questions with self-study. I’m writing this post to give back to the community some of my study practices that allowed me to conquer this beast of an exam. The r/CISSP Reddit Community was...","categories": ["certification"],
        "tags": ["cissp","certification","study advice","best practices"],
        "url": "https://gr0sabi.github.io/certification/cissp-after-action-report/",
        "teaser": "https://gr0sabi.github.io/assets/images/cissp-post/CISSP.png"
      },{
        "title": "OpenAdmin Write-Up: HackTheBox",
        "excerpt":"TL;DR OpenAdmin was a fun, easy machine with an interesting internal web application. With only two open ports, SSH (22) and HTTP (80) the attack surface is minimal. Web enumeration revealed a few web applications, one being an outdated OpenNetAdmin IP Address Management (IPAM) system (v18.1.1), which allowed RCE as...","categories": ["hackthebox"],
        "tags": ["hackthebox","hacking","penetration testing","write-ups"],
        "url": "https://gr0sabi.github.io/hackthebox/openadmin-write-up-hackthebox/",
        "teaser": "https://gr0sabi.github.io/%5Cassets%5Cimages%5Chtb%5Copenadmin%5Cbanner-openadmin.png"
      },{
        "title": "Obscurity Write-Up: HackTheBox",
        "excerpt":"TL;DR Obscurity was a fantastic machine of medium difficulty by clubby789 at HackTheBox. Rolling a few custom Python scripts for a web service, encryption, and SSH, Obscurity gave a couple of holes that I could squeeze through. With only a couple of open ports, it led me straight to enumerating...","categories": ["hackthebox"],
        "tags": ["hackthebox","reversing","python","penetration testing","write-ups"],
        "url": "https://gr0sabi.github.io/hackthebox/obscurity-write-up-hackthebox/",
        "teaser": "https://gr0sabi.github.io/%5Cassets%5Cimages%5Chtb%5Cobscurity%5Cbanner-obscurity.png"
      },{
        "title": "Resolute Write-Up: Hack The Box",
        "excerpt":"TL;DR Resolute was a straight-forward medium-rated machine on Hack The Box created by egre55. Initial recon revealed an open LDAP service which leaked all local users and a default password. This allowed a password spray using WinRM and a successful login as user melanie. As melanie, further machine enumeration revealed...","categories": ["hackthebox"],
        "tags": ["hackthebox","dns","hacking","penetration testing","write-ups"],
        "url": "https://gr0sabi.github.io/hackthebox/resolute-write-up-hack-the-box/",
        "teaser": "https://gr0sabi.github.io/%5Cassets%5Cimages%5Chtb%5Cresolute%5Cresolute-banner.png"
      },{
        "title": "Nest Write-Up: Hack The Box",
        "excerpt":"TL;DR Nest was an excellent easy-rated machine on Hack The Box created by VbScrub. Initial recon revealed an open SMB port and an uncommon HQK Reporting service. Enumerating SMB revealed some default credentials, which allowed further read access. Digging further we come across some encrypted credentials and a Visual Basic...","categories": ["hackthebox"],
        "tags": ["hackthebox","smb","dnspy","penetration testing","write-ups"],
        "url": "https://gr0sabi.github.io/hackthebox/nest-write-up-hack-the-box/",
        "teaser": "https://gr0sabi.github.io/%5Cassets%5Cimages%5Chtb%5Cnest%5Cnest-banner.png"
      },{
        "title": "Book Write-Up: HackTheBox",
        "excerpt":"TL;DR Book was a medium machine on Hack The Box created by MrR3boot. Initial recon revealed a web application whose user registration is vulnerable to a SQL truncation attack, leading to login as admin. Once admin, we can inject XSS payloads to read local files through dynamically generated PDFs, which...","categories": ["hackthebox"],
        "tags": ["hackthebox","xxs","sqli","hacking","penetration testing","write-ups"],
        "url": "https://gr0sabi.github.io/hackthebox/book-write-up-hack-the-box/",
        "teaser": "https://gr0sabi.github.io/%5Cassets%5Cimages%5Chtb%5Cbook%5Cbook-banner.png"
      },{
        "title": "Traceback Write-Up - HackTheBox",
        "excerpt":"Summary Traceback was an easy-rated, Linux machine made by Xh4H on HackTheBox that allowed some Lua interaction and unique escalation of privileges. The port scan showed SSH and an Apache server running on port 80. Looking at the web server, it showed a compromised web page with an interesting comment...","categories": ["hackthebox"],
        "tags": ["hackthebox","hacking","penetration testing","write-ups","linux"],
        "url": "https://gr0sabi.github.io/hackthebox/traceback-write-up-hackthebox/",
        "teaser": "https://gr0sabi.github.io/%5Cassets%5Cimages%5Chtb%5Ctraceback%5Cbanner-traceback.png"
      }]
