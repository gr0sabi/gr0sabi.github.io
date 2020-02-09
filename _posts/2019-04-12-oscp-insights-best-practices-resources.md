---
layout: single
title:  "OSCP: Insights, Best Practices, and Resources"
excerpt: "I wrote this post to give back some of the insights I've discovered on my journey to becoming an OSCP. It will cover personal insights, resources, and best practices."
date: 2019-04-13
# classes: wide
categories: [security]
tags: [oscp, hacking, penetration testing, offensive security, certification]
header:
  teaser: /assets/images/oscp-post/offsec-oscp.png
  teaser_home_page: true
toc: true
toc_label: "Table of Contents"
toc_icon: "database"  # corresponding Font Awesome icon name (without fa prefix)
toc_sticky: true
---
![](/assets/images/oscp-post/offsec-oscp.png)
## Purpose 
I wrote this post to give back some of the insights I've discovered on my journey to becoming an OSCP. It will cover personal insights, resources, and best practices. There is *a lot* of great information available on the Internet so I will make an honest effort not to sound like a broken record.

### A Little About Me
Going into the certification I held a B.S. in Information and Computer Science and was actively certified a CCNA, CEH, Sec+, Net+ and A+. In the IT realm, I've got Network Engineering experience with mobile Cisco deployments and System Administration experience on both Linux and Windows Domains. But, like most readers of this post, *I wanted to step it up a notch*. 

<sub>**Note**:  I feel that CEH did *very little* to prepare me for OSCP. It's essentially a requirement for my current employment, as an [approved baseline certification](https://iase.disa.mil/iawip/pages/iabaseline.aspx). CCNA was more useful, in my opinion.</sub>

<img src="https://media.giphy.com/media/NFA61GS9qKZ68/giphy.gif" width="50%" alt="Strategy">

## Pre-PWK Preparation 
Albeit a decent background in Information Technology, I felt inadequately prepared. My professional experience gave me some requisite knowledge in networking, development, and various operating system flavors. But, I needed more knowledge. Here are some of the things I did that I think served me well prior to PWK. 

### Reading
I read (lurked) *nearly* every post on the [OSCP subreddit](https://www.reddit.com/r/oscp){:target="_blank"}. I found it very useful to get into this community and get an understanding of some of the best practices (and struggles) associated with pursuing the certification. For the non-Redditor, sort by **Top** and **All Time** for great resources and sage advice. 

The following books I read and found useful, but can go beyond the scope of OSCP:
+ [Grey Hat Hacking](https://amzn.to/2I78dB2){:target="_blank"}
+ [The Web Application Hacker's Handbook, 2nd Ed.](https://amzn.to/2D25qF0){:target="_blank"}
+ [Violent Python](https://amzn.to/2UzD1jR){:target="_blank"}
+ [Black Hat Python](https://amzn.to/2IaXF3Q){:target="_blank"}

<sub>**Note**:  I scooped up a couple Humble Book Bundles from [Wiley](https://www.goodreads.com/list/show/126519.Humble_Book_Bundle_Cybersecurity_2_0_by_Wiley) and [No Starch Press](https://www.goodreads.com/list/show/130690.humble_bundle_hacking_for_the_holidays) on Hacking, so keep your eyes peeled for those. I got around 30 books for $30 USD, and a sizable portion of the purchase goes to charity. Most of the books were beyond the scope of OSCP, but were good reading, and work well to get in the proper mindset.</sub> 

### Videos
I watched every [ippsec YouTube](https://www.youtube.com/channel/UCa6eh7gCkpPo5XXUDfygQQA/videos){:target="_blank"} video and took notes on tools, tips, commands and methodology. This takes a lot of time - but it's worth every second. If I didn't understand an exploit or method, I googled it and did some reading. This is phenomenal for seeing an experienced penetration testing methodology in action. 

### HackTheBox
Another invaluable resource to go along side of [ippsec's videos](https://www.youtube.com/channel/UCa6eh7gCkpPo5XXUDfygQQA/videos){:target="_blank"} is [HackTheBox](https://www.hackthebox.eu/){:target="_blank"}. I purchased a VIP membership for about 6 months prior to PWK and spent time attacking their boxes and doing various challenges. *This is extremely useful.* It's true that some of the machines are unlike the PWK network because HTB can be kind of CTF-oriented and/or out-of-scope within the [PWK](https://www.offensive-security.com/information-security-training/penetration-testing-training-kali-linux/){:target="_blank"} material, but that does not matter in my opinion. Working within the Kali environment, learning the tools and developing a solid pen-testing methodology is what matters here.

<sub>**Note**:  I did not use [VulnHub](https://www.vulnhub.com/){:target="_blank"}, but I [read](https://www.abatchy.com/2017/02/oscp-like-vulnhub-vms){:target="_blank"} that some of the machines are similar to exploiting some of the PWK Lab machines.</sub>

### Note-Taking

*OneNote*. I used OneNote extensively with all the HTB machines and got very familiar with the application. Within OneNote I created a PenTest Notebook that I could put all my favorite commands, shells, tools, overflow processes, screenshots, etc. Basically, anything I found myself looking up repetitively and needing to copy/paste frequently. 

+ A definite plus is that it syncs to OneDrive and backs up all your data. 
+ It has web and mobile applications that you can use remotely.

## Useful Resources
Below are excellent online resources that I utilized:

### Linux 
[Basic Linux Enumeration by g0tmi1k](https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/){:target="_blank"}<br />
[Linux Privilege Escalation by Guifre Ruiz](https://guif.re/linuxeop){:target="_blank"}<br />
[GTFOBins Project](https://gtfobins.github.io/){:target="_blank"}

### Windows
[Windows Privilege Escalation Fundamentals by FuzzySecurity](http://www.fuzzysecurity.com/tutorials/16.html){:target="_blank"}<br />
[Windows Privilege EoP by Guifre Ruiz](https://guif.re/windowseop){:target="_blank"}<br />
[Windows Privilege Escalation Guide by Absolomb](https://www.absolomb.com/2018-01-26-Windows-Privilege-Escalation-Guide/){:target="_blank"}<br />
[LOLBAS Project](https://lolbas-project.github.io/#){:target="_blank"}

### Pentesting
[The Magic of Learning](https://bitvijays.github.io/index.html){:target="_blank"}<br />
[SANS Penetration Testing Resources](https://pen-testing.sans.org/resources/downloads){:target="_blank"}<br />
[A Red Teamer's Guide to Pivoting by Artem Kondratenko](https://artkond.com/2017/03/23/pivoting-guide/){:target="_blank"}

### Stack-Based Buffer Overflow 
[The Presentation and Tutorial for Cross-Site Scripters Who Can't Stack Buffer Overflow Good and Want to Do Other Stuff Good Too](https://github.com/justinsteven/dostackbufferoverflowgood){:target="_blank"}<br />
[VeteranSec's 32-Bit Windows Buffer Overflows Made Easy](https://veteransec.com/2018/09/10/32-bit-windows-buffer-overflows-made-easy/){:target="_blank"}<br />
[Exploit Writing Tutorial: Stack Based Overflows by Corelanc0d3r](https://www.corelan.be/index.php/2009/07/19/exploit-writing-tutorial-part-1-stack-based-overflows/){:target="_blank"}<br />
[Mona.py - The Manual by Corelanc0d3r](https://www.corelan.be/index.php/2011/07/14/mona-py-the-manual/){:target="_blank"}

### OSCP Specific Guides
[Passing OSCP by Scund00r](https://scund00r.com/all/oscp/2018/02/25/passing-oscp.html){:target="_blank"}<br />
[OSCP: RFI and LFI by Awakened](https://awakened1712.github.io/oscp/oscp-lfi-rfi/){:target="_blank"}<br />
[OSCP: Transfer Files from Kali to the Target Machine by Awakened](https://awakened1712.github.io/oscp/oscp-transfer-files/){:target="_blank"}<br />
[Total OSCP Guide by Sushant747](https://sushant747.gitbooks.io/total-oscp-guide/){:target="_blank"}<br />
[OSCP Repo by Rewardone](https://github.com/rewardone/OSCPRepo){:target="_blank"}

## My Experience with PWK
I signed up for the 60 day lab time, of which life only allowed probably 35-40 days of that. I took a week of leave from work to spend dedicated time doing all the exercises and course material initially. The course materials (Lectures and Course Guide) teach you everything you need to know to successfully compromise machines with Kali Linux within the Lab network.

Afterwards, I was able to fully compromise about 90% of the machines. I took field notes and screenshots on every machine as if I were going to write a report on them. I created a map of the entire lab network(s) so I could track my overall progress and coverage.

I scheduled my exam for day 58 of my lab time. As test day approached, I did not spend any time attacking the remaining machines but focused more on test-day preparations and brushing up my buffer overflow process. 

<sub>**Note**:  I did *not* submit a lab report because I did not want to writeup 10 machines for a 5 point differential. I reasoned that my study time would be better spent in the lab. Yet, I did do *all exercises* and recorded my answers. I recommend that if you have the time, do the lab report and submit it.</sub>

### Forum and Independent Research
Whenever I found myself 100% stuck with no other resource, I utilized the OffSec forums, which can more or less guide you in a better direction. Obviously, it's better to not use it because it can be sometimes a little too "hinty". You **must** be able to *eventually* research independently and not lean on the OffSec Student forum.

## Exam Strategy
Naturally, I will not talk about what's on the exam but focus on key points. 

Thoroughly read and completely understand the [test guide](https://support.offensive-security.com/oscp-exam-guide/){:target="_blank"} prior to sitting the challenge. *I've noticed it is updated fairly regularly.* Reading about other experiences, simple errors on the report and missing key details on the guidance have led to a failure, despite fully compromising all machines.

*Food*. I planned my food prior to the exam to give me one less thing to focus on that day. I chose food and beverages that would keep my energy levels up and not make me lethargic. 

*Music*. I prefer music when I'm focusing or studying, so I had a few playlists planned out. During the exam, I had music on Spotify the entire time to keep me in my comfort zone. 

*Sleep*. One thing I could have done better was getting *better* sleep prior to exam day - my brain did not want to sleep that night (probably due to anxiety), so I was slightly sleep-deprived during the exam.

<img src="https://media.giphy.com/media/LTYT5GTIiAMBa/giphy.gif" width="50%" alt="Sleepy">


### Testing VM
I used a fully updated [64-bit Kali VirtualBox VM](https://www.offensive-security.com/kali-linux-vm-vmware-virtualbox-image-download/){:target="_blank"} within my personal Windows 10 host machine, but I had the provided PWK Kali VMWare VM on standby, if needed. I personally did not have any issues with this configuration during the exam and is a chance I took against the recommendation of Offensive Security.

### OSCP Exam Challenge
I concur with others in the community and believe that utilizing [Reconnoitre](https://github.com/codingo/Reconnoitre){:target="_blank"} while knocking out the Buffer Overflow is the most efficient way to begin the exam. Obviously, test and become familiar with Reconnoitre's usage and outputs **prior** to the exam if you choose to use it. This is the Nmap command line that Reconnoitre used for a single machine, using a ```--services``` argument:
```
nmap -vv -Pn --disable-arp-ping -sS -A -sC -p- -T 3 -script-args=unsafe=1 -n -oN /root/Documents/PWK/OSCP/boxes/192.168.XX.XX/scans/192.168.XX.XX.nmap -oX /root/Documents/PWK/OSCP/boxes/192.168.XX.XX/scans/192.168.XX.XX_nmap_scan_import.xml 192.168.XX.XX
```

In regards to the [*single use*](https://support.offensive-security.com/oscp-exam-guide/#section-1-exam-requirements){:target="_blank"} of Metasploit Modules and Meterpreter, I saved it until I *thoroughly* attempted every remaining machine **manually**. This strategy worked out in my favor, so it is good practice in the PWK Lab environment to attempt to compromise all machines manually.

I recorded the entire exam with [OBS](https://obsproject.com/){:target="_blank"}, following the advice of many. This was *very* useful, as I missed a couple screenshots that I thought were useful for the report. 

The proctors were not an issue and were professional and unobtrusive. The webcam and communication with them was smooth, other than a single webcam restart.

#### Progress Checklist
Within OneNote, I created a "Progress Checklist" tab, so I didn't miss any major items. I modified it to fit the exam scope once I received the instructions. This was the basic structure:
```
Progress Checklist
├── Box 1 - 192.168.X.X
│   ├── local.txt
│   │    ├── Screenshot with ipconfig/ifconfig
│   │    └── Submitted in Control Panel
│   ├── proof.txt
│   │    ├── Screenshot with ipconfig/ifconfig
│   │    └── Submitted in Control Panel
├── Box 2 - 192.168.X.X
│    ├── local.txt
│    │    ├── Screenshot with ipconfig/ifconfig
│    │    └── Submitted in Control Panel
│    └── proof.txt
│         ├── Screenshot with ipconfig/ifconfig
│         └── Submitted in Control Panel
└── etc...
```

### Report Tips

Pre-stage your report. You can prep a decent portion of the report prior to the exam. This will save you some time after your exam ends. Even though I did this, I still spent roughly 10 hours compiling my 56 page report for submission. I did not try to reinvent the wheel and used the [recommended template](https://support.offensive-security.com/pwk-reporting/){:target="_blank"}, only modifying it to fit the exam requirements.

Don't "YOLO" the report. It's *part* of the challenge. Be meticulous and triple-check everything. Before you submit, reread the [Test Guide](https://support.offensive-security.com/oscp-exam-guide/){:target="_blank"} and [PWK Reporting Guidelines](https://support.offensive-security.com/pwk-reporting/){:target="_blank"} and check your formatting, security and compression.

I used this report structure to include my findings of the exam, found on [scund00r's blog](https://scund00r.com/all/oscp/2018/02/25/passing-oscp.html#exam){:target="_blank"}:
```
Offensive Security Exam Penetration Test Report
│   ├── Introduction
│   ├── Objective
│   └── Scope
├── High-Level Summary
│   └── Recommendations
├── Methodologies
│   ├── Information Gathering
│   ├── Service Enumeration
│   ├── Penetration
│   ├── Maintaining Access
│   └── House Cleaning
└── Findings
    ├── Box1 - 10.10.10.1
    ├── Box2 - 10.10.10.2
    ├── Box3 - 10.10.10.3
    ├── Box4 - 10.10.10.4
    └── Box5 - 10.10.10.5
```

## Results
It took 6 days to get my results - 4 business days and a weekend. While it felt like the longest wait of my life, the results finally came in and it was official, I had passed the OSCP. 

<img src="{{ site.url }}{{ site.baseurl }}/assets/images/oscp-post/20190412_135924-min.jpg" alt="OSCP Certificate">
<figcaption>Woohoo! I did it. :joy: </figcaption><br />

## Final Thoughts
I *really* enjoyed everything. The PWK course and the OSCP Exam Challenge was one of the most rewarding and humbling learning experiences I've professionally had. It's one of very few certifications that lets you feel part of a community that is passionate about Information Security. Now to really dig deep and go for ~~OCSE~~ AWAE/OSWE!

Good luck, try harder, and DM me on [Twitter](https://twitter.com/gr0sabi){:target="_blank"} if you need anything.