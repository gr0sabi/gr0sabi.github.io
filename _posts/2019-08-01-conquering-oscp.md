---
layout: single
title:  "Conquering OSCP"
categories: [blog]
tags: [oscp, hacking, penetration testing, offensive security]
toc: true
toc_label: "Table of Contents"
toc_icon: "database"  # corresponding Font Awesome icon name (without fa prefix)
toc_sticky: true
---
# Purpose 
I wrote this post to give back some of the insights I've discovered on my journey to becoming an OSCP. It will cover personal insights, resources, and best practices. There is already *a lot* of great information available on the Internet so I will make an honest effort not to sound like a broken record.  

## My Background 
When pursuing specialized credentials like OSCP and getting advice to pursuing that certification, I think it's important to understand the person's background in that sector. Going into the certification I held a B.S. in Information and Computer Science and was actively certified a CCNA, CEH, Sec+, Net+ and A+. I've got Network Engineering experience with small Cisco deployments and System Administration experience on both Linux and Windows Domains. But, like most perusers of this post, *I wanted to break all the things and get paid for it*. Enter OSCP...

## Pre-PWK Preparation 
Albeit a decent background in Information Technology, I felt inadequately prepared. My professional experience gave me some requisite knowledge in networking, development, and operating system flavors. But, I needed more knowledge. Here are some of the things I did that I think served me well prior to PWK. 

### Reading
I read *nearly* every post on the [OSCP subreddit](https://www.reddit.com/r/oscp). I found it very useful to get into the community and get an understanding of some of the best practices (and struggles) associated with pursuing the certification. For the *good stuff*, sort by **Top** and **All Time**. 

I found the following books useful overall:
+ [Grey Hat Hacking]()
+ [The Web Application Hacker's Handbook, 2nd Ed.]()
+ [Violent Python]()

Stack Buffer Overflows:
+ [VeteranSec's 32-Bit Windows Buffer Overflows Made Easy](https://veteransec.com/2018/09/10/32-bit-windows-buffer-overflows-made-easy/)
+ [The Presentation and Tutorial for Cross-Site Scripters Who Can't Stack Buffer Overflow Good and Want to Do Other Stuff Good Too](https://github.com/justinsteven/dostackbufferoverflowgood)

### Videos
I watched every [ippsec YouTube](https://www.youtube.com/channel/UCa6eh7gCkpPo5XXUDfygQQA/videos) video and took notes on tools, tips, commands and methodology. This took a lot of time - but it's worth every second. If I didn't understand an exploit, I googled it and did some reading. Phenomenal for seeing an experienced penetration testing methodology in action. I still watch every new upload - they're great!

### HackTheBox
Another invaluable resource is [HackTheBox](https://www.hackthebox.eu/). I got a VIP membership for about 6 months and spent time hacking boxes and doing challenges. It's true that some of the machines are unlike the PWK network because HTB can be kind of CTF-oriented, but that does not matter in my opinion. I did not use VulnHub, but I read that some of the machines are a good resource.

### Tools
Effective use of tools are key. Nmap. Didn't use SQLMap, except for exercises. Be very familiar with Metasploit and Meterpreter, but learn to work without it.

OneNote. I used OneNote with all the HTB machines and got very familiar with it. Within OneNote I created a PenTest Notebook that I could put all my favorite commands, shells, tools, etc. for various vulnerabilities.

## Experience with PWK
I signed up for the 60 day lab time, of which life only allowed probably 35-40 days of that. I took a week of leave from work to spend dedicated time doing all the exercises initially. Afterwards, I was able to get about 90% of the machines. As test day approached, I did not spend any time attacking the remaining machines but more focused on preparing. I did not submit a lab report.

## OSCP Exam Challenge
Naturally, I will not talk about what's on the exam but about strategy. 

### Exam Strategy
Thoroughly read and completely understand the [test guide]() prior to sitting the challenge. Reading about other experiences, simple errors on the report and missing key details on the guidance have led to a failure.

I used a fully updated 64-bit Kali VirtualBox VM with a Windows 10 host machine, but I had the 32-bit PWK VM on VMWare on standby. I planned my food and ate regularly during the test. The proctors were not an issue and were polite and unobtrusive. I had music on Spotify the entire time and had fun doing what I loved - being challenged. 

Screenshot every action. Screenshot every output. Copy and paste commands into your notes. 

#### Progress Checklist
Within OneNote, I created a "Progress Checklist" tab, so I didn't miss any major items. I modified to fit the exam scope once I received the instructions. This was the basic structure:
```
Progress Checklist
├── Box 1 - 192.168.X.X
│   ├── local.txt
│   │    ├── Screenshot with ipconfig/ifconfig
│   │    └── Submitted in Panel
│   ├── proof.txt
│   │    ├── Screenshot with ipconfig/ifconfig
│   │    └── Submitted in Panel
├── Box 2 - 192.168.X.X
│    ├── local.txt
│    │    ├── Screenshot with ipconfig/ifconfig
│    │    └── Submitted in Panel
│    └── proof.txt
│         ├── Screenshot with ipconfig/ifconfig
│         └── Submitted in Panel
└── etc...
```

In regards to the use of Metasploit Modules and Meterpreter, I saved it until I *thoroughly* attempted every remaining machine manually. This strategy worked out in my favor.

I recorded the entire exam with OBS, following the advice of others. This was *very* useful, as I missed a couple screenshots that I thought were needed. I remember reading that the resolution of the screenshots matters - so keep this in mind.

### Report Tips

Pre-stage your report. You can prep a decent portion of the report template prior to the exam. This will save you some time the next day. Even though I did this, I still spent roughly 10 hours compiling the report for submission.

Don't "YOLO" the report. It's *part* of the challenge. Be meticulous and triple-check everything. Before you submit, reread the Test Guide and check your formatting, security and compression.

I used and passed with this report structure, found on [scund00r's blog](https://scund00r.com/all/oscp/2018/02/25/passing-oscp.html#exam):
```
OSCP
├── Offensive Security Lab Penetration Test Report
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
    ├── Box1 - 10.10.10.10
    ├── Box2 - 10.10.10.11
    ├── Box3 - 10.10.10.12
    ├── Box4 - 10.10.10.13
    └── Box5 - 10.10.10.14
```

# Results
It took 6 days to get my results. Yes that's right, 4 business days, including the weekend. It felt like the longest wait of my life. But when the results came in, it was official, I had actually passed the OSCP on my first attempt. 

# Final Thoughts
The PWK course and the OSCP Exam Challenge was one of the most rewarding experiences I've had professionally. It's one of very few certifications that makes you *feel* a part of a community that is passionate about Information Security and makes one truly understand what it means to "Try Harder!".