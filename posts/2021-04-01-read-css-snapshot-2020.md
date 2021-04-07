---
title: 读：CSS 2020 快照
date: 2021-04-01T13:49:32
tags:
  - CSS
---

> 读系列指阅读某篇文章，输出大意、感想等，大意不与原文一一对应。

> 本文阅读 CSS 2020 快照，主要关注现行的一些 CSS 规范

- 摘要

收录所有稳定标准到一份文档以描述 CSS 当下的状态（2020），由于该文档以标准稳定程度而非浏览器实现情况描述个模块，因此文档的主要受众为 CSS 实现者，而非使用者。

CSS 是一门描述结构化文档（如：HTML、XML）在屏幕、纸张等媒介上如何渲染的语言。

- 本文档状态

本文展现了 2020 年 CSS 的状态。工作组不会在本文中描述任何未来的变更：随着 CSS 进展，新的快照将发布于 [https://www.w3.org/TR/CSS/](https://www.w3.org/TR/CSS/)

## 介绍

在 CSS 标准首次发布时，仅仅一份文档就包含了全部的 CSS，即 CSS 1。CSS 2 同样由一份多章节的文档定义。但在 CSS 2 之后，CSS 工作组采用了模块化的方式，每个模块定义了 CSS 的一个部分，而不是定义一份完整巨大的 CSS 标准。这样可以更快速地迭代提升 CSS。

由于不同的 CSS 模块处于不同的稳定级别，CSS 工作组用本文档来定义 CSS 的当前范围和状态。本文档只会包含工作组认为足够稳定（stable）的规范。

### 背景：W3C 流程和 CSS

在 W3C 的流程中，文档存在 3 个级别的稳定性：

- **Working Draft(WD)**
  
  W3C 标准的设计阶段

- **Candidate Recommendation (CR)**
  
  测试阶段：需要测试与实现，伴随测试与实现，标准可能会进行一些演变。

- **Recommendation(REC)**

  维护阶段：只会进行勘误

## CSS 规范分类

### CSS —— 官方定义

在 2020 年，CSS 由下列规范定义。

- [CSS Level 2, latest revision](https://www.w3.org/TR/CSS2/) **含勘误**

  本规范定义了 CSS 的核心，本规范的部分内容由后期的其它规范更新。建议阅读本规范的 [第二章](https://www.w3.org/TR/CSS2/intro.html)，该章介绍了 CSS 的基础概念与其设计原则。

- [CSS 语法 3](https://www.w3.org/TR/css-syntax-3/)

  代替 CSS2§4.1, CSS2§4.2, CSS2§4.4, and CSS2§G，重新定义了 CSS 如何被解析

- [CSS Style Attributes](https://www.w3.org/TR/css-style-attr/)

  定义怎样的 CSS 声明可以嵌入标记属性中

> 未完待续


### CSS 级别

CSS 没有传统的版本，而是使用了级别（level）。每个级别的 CSS 基于上一级别构建，改进定义并添加功能。每个更高级别的功能集均是低级别的超集，且对于已存在的功能，更高级别功能的行为是低级别该功能行为的子集。因此，符合更高标准 CSS 的用户代理默认符合所有低级别 CSS

- CSS 级别1
  
  已被废弃

- CSS 级别2

  CSS2 当前已被 CSS2.1 更新，两个规范间有冲突的以 2.1 为准。

- CSS 级别3

  CSS3 基于 CSS2 各模块构建，以 CSS2.1 为核心

- CSS 级别4

  没有 CSS 级别4，各模块可以各自达到级别4或更高级别，但 CSS 语言不再有级别（CSS 级别3 仅作为区分先前整体定义的规范）

### CSS 概述

不是所有的 CSS 实现会都实现 CSS 中定义的全部功能。

工作组过去发布的一些规范定义了各类用户代理应该支持的 CSS 最小集，但由于各种原因，今后发布的 CSS 规范则允许用户代理部分实现。

> 注意：即使部分实现 CSS 也需要向前兼容解析规则。

## 实现 CSS 需要具备的责任

略

## 参见

- [CSS Snapshot 2020](https://www.w3.org/TR/CSS/#intro)