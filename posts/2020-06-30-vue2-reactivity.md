---
title: 实现 Vue 2 响应式系统
date: 2020-06-30T16:39:01
tags:
  - vue
---

## 前言

当你更新 vue 实例 data 的某个属性，依赖该属性的所有内容随之重新执行，你或许知道这是 vue 通过 `defineProperty` 实现的响应式系统，但具体是如何实现的，`define` 了哪些 `property`？

## 响应式系统要解决的问题

先不考虑 Vue，看一个小片段

```js
let price = 5
let quentity = 2
let total = price * quentity
```

在上面的片段执行完后，重新给 `price` 或 `quentity` 赋值，`total` **并不会** 自动更新。除非重新执行一次 `total = price * quentity`，那么问题就来了

**如何在每次 `price` 或 `quentity` 重新赋值后，自动执行 `total = price * quentity` ？**

接下来就是设计一个系统，也就是响应式系统，来解决上述问题。

## 解决问题的关键点

回到问题

> 如何在每次 `price` 或 `quentity` 重新赋值后，自动执行 `total = price * quentity` 

这里有几个关键点

1. 首先的关键点是**自动执行**，既然是自动执行，说明系统要能**检测**到 `price` 或 `quentity` 的重新赋值
   
2. 第二个关键点是**每次**，就是每更改一次 `price` 或 `quentity`，就需要重新执行一次 `total = price * quentity`。这说明系统需要有个地方保存 `total = price * quentity`，才可以每次变化后执行
   
3. 第三个关键点是 **`price` 或 `quentity`**，只有在 `price` 或 `quentity` 这两个变量变化时，才重新执行 `total = price * quentity`。说明这二者存在关联，且系统应该自动建立并保存这种关联。
  
> 举一个没有关联的反例：比如对 `total` 重新赋值，系统不会执行 `total = price * quentity`

## 攻克关键点，响应式系统原型

### 如何检测 `price`、`quentity` 的重新赋值

答案：`defineProperty` 中的 `set`。

`defineProperty` 是用来定义对象的属性，而不是直接的某个变量。因此，调整下小片段

```js
const data = {
  price: 5,
  quentity: 2
}
let total = data.price * data.quentity

Object.keys(data).forEach(function defineReactive(key) {
  let value = data[key]
  Object.defineProperty(data, key, {
    get: function() {
      return value
    },
    set: function(newValue) {
      if (value === newValue) return
      value = newValue
      console.log(`${key} is changed.`)
    }
  })
})
```

### 如何保存 `total = price * quentity`

答案：通过函数保存

调整小片段

```js
// ...
let total
function main() {
  total = data.price * data.quentity
}
main()
// ...
```

此时更改 `console.log` 为调用 `mian`，那么就实现了一个写死的微型响应式系统

```js
const data = {
  price: 5,
  quentity: 2
}
let total
function main() {
  total = data.price * data.quentity
}
main()

Object.keys(data).forEach(function defineReactive(key) {
  let value = data[key]
  Object.defineProperty(data, key, {
    get: function() {
      return value
    },
    set: function(newValue) {
      if (value === newValue) return
      value = newValue
      main()
    }
  })
})
```

![](./images/00042.png)

### 如何自动建立变量与计算过程的关联

首先，我们要建立的是 `data.price`、`data.quentity` 与 `total = data.price * data.quentity` 的关联。

观察 `total = data.price * data.quentity`，步骤如下

- **读取** `data.price`，**读取** `data.quentity`
- 将 `data.price` 与 `data.quentity` 相乘
- 将上一步的计算结果赋值给 `total`

注意到**读取**操作，我们知道**读取**操作会通过 `defineProperty` 的 `get` 方法，因此，如果能在 `get` 时保存正在执行的计算过程（这里是：`total = data.price * data.quentity`），就可以建立变量与计算过程的关联。

同时，需要在首次执行 `total = data.price * data.quentity` 时就能触发 `get` 进行关联；且后续执行时不触发。

```js
let target = null

const data = {
  price: 5,
  quentity: 2
}
let total

function main() {
  total = data.price * data.quentity
}

Object.keys(data).forEach(function defineReactive(key) {
  let value = data[key]
  let cb = null
  Object.defineProperty(data, key, {
    get: function() {
      if (target) cb = target
      return value
    },
    set: function(newValue) {
      if (value === newValue) return
      value = newValue
      if (cb) cb()
    }
  })
})

target = main
main()
target = null
```

至此，一个微型响应式系统已经实现完毕。

## Vue 中的代码组织方式

TODO: 未完待续