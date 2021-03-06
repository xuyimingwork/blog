---
title: 建站
date: 2020-04-11T23:35:53
tags:
  - 建站
---

## 概览

整个建站过程分为两个部分，一个是准备域名、服务器之类的事情，另一个是代码，也就是网站本身。

准备部分大概包括
 - 域名注册
 - 服务器（硬件）申请
 - 网站备案
 - 配置域名 DNS 解析
 - 申请 SSL 证书

程序部分大概包括
 - 准备静态网站代码
 - 配置 CircleCI 持续集成与部署
 - Nginx 服务器（软件）配置与启动

## 过程

准备部分的话，整个准备部分我是在腾讯云完成的，整个体验可以说得上顺畅，整个流程包括网站备案都是线上的：备案过程只是准备好材料，填写一番，提交腾讯云先审核，不符合的部分会有小姐姐回电和你沟通修改。可能配置 DNS 解析会遇到些问题，不过多试几次就好了。

代码托管在 GitHub 上，我个人是想做到每次提交，有个玩意可以自动构建并将构建结果推至服务器端进行部署，也就是持续集成和持续部署。受 Vue 项目的影响，选择了 CircleCI 完成这部分工作。配置 CircleCI 这步卡了我非常长的时间，总算初步达成目的，这部分待晚些单开一篇说明。

Nginx 是挺有意思的东西，这次选择作为服务器，也算是初步接触了一下。

## 结果

结果自然是你现在看到的这样，实际上达成的效果与用 GitHub Page 是一致的。但是你有了自己的域名，自己的服务器，个人网站，了解了持续集成的一些东西，总归还是有点不一样。






