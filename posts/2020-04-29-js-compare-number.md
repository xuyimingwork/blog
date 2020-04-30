---
title: JavaScript Number 值比较（Number.EPSILON）
date: 2020-04-29T17:39:21
tags:
  - 计算精度
  - Number.EPSILON
---

由于数字精度限制，JavaScript 有个现象是

```js
0.3 - 0.2 === 0.1 // => false
```

于是有些文章说 JavaScript 应该用如下方式来比较

```js
Math.abs((0.3 - 0.2) - 0.1) < Number.EPSILON // => true
```

但这种方式仍然是错误的，有如下比较

```js
Math.abs(43.23 - 43 - 0.23) < Number.EPSILON // => false
Math.abs(1.1 + 2.2 - 3.3) < Number.EPSILON // => false
```