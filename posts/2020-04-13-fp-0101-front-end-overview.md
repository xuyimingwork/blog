---
title: 第01周-前端知识体系
date: 2020-04-13T23:20:36
tags:
  - 前端进阶训练营
---

前端知识体系大体分为 

- HTML
- JavaScript
- CSS
- API

## HTML

以维度划分，HTML 继承了不同的语言

### HTML as 计算机语言

- 语法

[WHATWG The HTML syntax](https://html.spec.whatwg.org/multipage/syntax.html#syntax)

- 词法

### HTML as SGML

> 从 SGML 角度对 HTML 进行定义

- DTD [Document Type Difinition](https://en.wikipedia.org/wiki/Document_type_definition)

- Entity

  > 注意，在 [HTML 4.01 DTD](https://www.w3.org/TR/REC-html40/sgml/dtd.html#HTMLlat1) 文档的 `Character mnemonic entities` 部分，定义了 Entities

### HTML as XML

> html 标签的 `xmlns` 属性，从 XML 角度对 HTML 进行定义

- Namespace
  - svg
  - mathml
  - aria

  
- Tag
  > [WHATWG 4 The elements of HTML](https://html.spec.whatwg.org/multipage/#toc-semantics)，获取代码 `Array.prototype.map.call($0.querySelectorAll('code'), el => `- ${el.innerHTML}\n`).join('')`，注，此方法需二次整理。

  > 另，从 [HTML 元素参考](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)，使用 `Array.prototype.map.call(document.querySelectorAll('td > a > code'), el => el.innerHTML).filter(str => str.startsWith('&lt;') && str.endsWith('&gt;')).map(str => str.replace('&lt;', '')).map(str => str.replace('&gt;', '')).filter((item, index, arr) => arr.indexOf(item, 0) === index)`，可查出 145 个元素
  
  **html**、**base**、**head**、**link**、**meta**、**script**、**style**、**title**、**body**、**address**、**article**、**aside**、**footer**、**header**、**h1**、**h2**、**h3**、**h4**、**h5**、**h6**、**hgroup**、**main**、**nav**、**section**、**blockquote**、**cite**、**dd**、**dt**、**dl**、**div**、**figcaption**、**figure**、**hr**、**li**、**ol**、**p**、**pre**、**ul**、**a**、**abbr**、**b**、**bdi**、**bdo**、**br**、**code**、**data**、**time**、**dfn**、**em**、**i**、**kbd**、**mark**、**q**、**rb**、**ruby**、**rp**、**rt**、**rtc**、**s**、**del**、**ins**、**samp**、**small**、**span**、**strong**、**sub**、**sup**、**u**、**var**、**wbr**、**area**、**map**、**audio**、**source**、**img**、**track**、**video**、**embed**、**iframe**、**object**、**param**、**picture**、**canvas**、**noscript**、**caption**、**col**、**colgroup**、**table**、**tbody**、**tr**、**td**、**tfoot**、**th**、**thead**、**button**、**datalist**、**option**、**fieldset**、**label**、**form**、**input**、**legend**、**meter**、**optgroup**、**select**、**output**、**progress**、**textarea**、**details**、**dialog**、**menu**、**summary**、**slot**、**template**、**acronym**、**applet**、**basefont**、**bgsound**、**big**、**blink**、**center**、**command**、**content**、**dir**、**element**、**font**、**frame**、**frameset**、**image**、**isindex**、**keygen**、**listing**、**marquee**、**menuitem**、**multicol**、**nextid**、**nobr**、**noembed**、**noframes**、**plaintext**、**shadow**、**spacer**、**strike**、**tt**、**xmp**

## JavaScript

标准文件 [ECMA-262](http://ecma-international.org/publications/standards/Ecma-262.htm)

### Grammar
  - Lex => 262 Lexical Grammar
    - WhiteSpace
    - LineTerminator
    - Comment
    - Token
      - Identifier
      - Keywords
      - Punctuator
      - NumericLiteral
      - StringLiteral
      - RegularExpressionLiteral
      - Template
  - Syntax
    - Atom
    - Expression
    - Structure
    - Scripts and Modules
### Semantics => 同 Syntax 一一对应
### Runtime
  - Type
    - Number
    - String
    - Boolean
    - Null
    - Undefined
    - Object
    - Symbol
    - 内部类型
      - Reference（类似于 C 语言中的指针？）
      - Completion Record
      - ...
  - 执行过程
    - Job => Function 对象在此时构建
    - Script/Module
    - Promise
    - Function
    - Statement
    - Expression
    - Literal
    - Identifier

## CSS

- 语法/词法
- @规则
  - charset
  - import
  - page
  - counter-style
  - keyframes
  - fontface
  - supports
  - namespace
- 普通规则
  - 选择器 => 标准独立，可在 JavaScript 中使用（querySelector）
    - 简单选择器
      - `.class`
      - `#id`
      - `tag`
      - `*`
      - `[attr=v]`
    - 复合选择器 => 组合简单选择器，选择器间为 and 关系
    - 复杂选择器
    - 选择器列表 => 逗号分隔
  - 属性
  - 属性值
- 机制
  - 排版
  - 伪元素
  - 动画
  - 优先级

参考文档

- [w3 标准列表](https://www.w3.org/TR/)
- [CSS 2](https://www.w3.org/TR/2011/REC-CSS2-20110607/)
  > CSS 3 开始，需要在各模块中找寻 CSS 语法

## API

以开发环境划分：Browser、Node、Electron、小程序

### Browser

[web platform api](https://webplatform.github.io/docs/apis/)

- DOM => [whatwg dom specification](https://dom.spec.whatwg.org/)
  - Node
  - Event
  - Range
