---
title: JavaScript Number 与 String 类型互转
date: 2020-04-29T10:30:42
tags:
  - JavaScript 类型
  - 类型转换
---

## 背景

实现 `parseFloat` 与 `Number.prototype.toString` 类似功能的方法

## String To Number

- 代码见：[convertStringToNumber](https://github.com/xuyimingwork/Frontend-01-Template/blob/master/week03/s2n.js)

## Number To String

- 代码见：[convertNumberToString](https://github.com/xuyimingwork/Frontend-01-Template/blob/master/week03/n2s.js)

## 总结

上述方法在使用时存在精度问题，关于精度问题，前端的计算操作应使用专门的计算库

另见：[JavaScript Number 值比较（Number.EPSILON）](./2020-04-29-js-compare-number.md)