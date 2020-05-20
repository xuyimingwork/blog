---
title: Vue 响应式系统
date: 2020-05-06T16:17:16
tags:
  - vue
---

## 前言

当你更新 vue 实例的某个属性，使用该属性的方法随之重新执行，你或许知道这是 vue 的响应式系统，它在 vue 2.0 中通过 `defineProperty` 实现，在 vue 3.0 中通过 `proxy` 实现，但具体它是如何实现的，思路和原理是什么？

## 场景

```js
let price = 5
let quentity = 2
let total = price * quentity
```

在上述代码执行之后，你对 `price` 变量赋值，`total` 并不会依据新的 `price` 自动重新计算，除非你手动执行 `total = price * quentity`，但在响应式系统中，这些可以自动完成。

为明白响应式系统的工作，先将上述代码划分下角色：
- `price`、`quentity`、`total` 是变量
- `total = price * quentity` 是计算过程

那么响应式系统完成的工作有：
- 检测 `price`、`quentity` 变量是否发生变化
- 保存 `total = price * quentity` 并在 `price`、`quentity` 发生变化后重新执行该计算过程
- 建立变量与计算过程的联系，即 `price`、`quentity` 发生变化时执行相应的 `total = price * quentity`，而不是其它计算过程。

TODO: 未完待续
