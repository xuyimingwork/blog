---
title: 译：Promises/A+
date: 2020-12-09T17:13:25
tags:
  - 翻译
  - promise
---

一份完整、通用的 JavaScript promise 开放标准——由实现者编写，供实现者参考。

一个 *promise* 表示一个异步操作的最终结果。与 promise 交互的首选方式是通过它的 `then` 方法注册回调，以接收 promise 的最终结果或该 promise 无法兑现（fulfill）的原因。

本规范详细描述了 `then` 方法的行为，提供了一个通用基础，所有符合 Promises/A+ 的 promise 实现均可提供这些行为。因此，可以认为本规范非常稳定。尽管 Promises/A+ 组织为解决一些新发现的边缘情况偶尔会对本规范做一些微小、向后兼容的修订，对于较大或不兼容的更改，只有在充分考虑、讨论、测试后我们才会添加。

从演变过程看，Promises/A+ 明确了早期 [Promises/A 提案](http://wiki.commonjs.org/wiki/Promises/A) 中的行为、将其拓展以覆盖一些事实标准的行为，并删除了不明确或有问题的部分。

最终，Promises/A+ 规范的核心内容并未涉及如何创建、兑现、或拒绝 promise，而是选择明确一个通用的 `then` 方法。在未来的其它相关规范中可能会涉及这些未提及的主题。

## 术语

1. “promise” 是一个带 `then` 方法的对象或函数，`then` 方法的行为将符合本规范
2. “thenable” 是一个定义了 `then` 方法的对象或函数
3. “value” 是任何合法的 JavaScript 值（包括 `undefined`，thenable、或 promise）
4. “exception” 是通过 `throw` 语句抛出的值
5. “reason” 是一个值，该值指明了 promise 被拒绝的原因

## 要求

### Promise 的状态

一个 promise 只能处于下面三种状态中的一种：

- pending
- fulfilled
- rejected

1. 当处于 pending 状态：
   1. 可以转换为 fulfilled 状态或 rejected 状态
2. 当处于 fulfilled 状态：
   1. 不可以转换为其它任何状态
   2. 必须拥有一个 value，且 value 不可改变
3. 当处于 rejected 状态：
   1. 不可以转换为其它任何状态
   2. 必须拥有一个 reason，且 reason 不可改变

这里，“不可改变” 的意思是本身不可变（如：`===`），但不指深层不可变

### `then` 方法

promise 必须提供 `then` 方法用于访问它当前或最终的 value 或 reason

promise 的 `then` 方法接受两个参数：

```js
promise.then(onFulfilled, onRejected)
```

1. `onFulfilled` 与 `onRejected` 都是可选参数
   1. 若 `onFulfilled` 不是函数，则必被忽略
   2. 若 `onRejected` 不是函数，则必备忽略
2. 若 `onFulfilled` 是函数
   1. 它必须在 `promise` 处于 fulfilled 后被调用，首个参数为 `promise` 的 value
   2. 它在 `promise` 处于 fulfilled 前必须不被调用
   3. 它必须不能被调用超过一次
3. 若 `onRejected` 是函数
   1. 它必须在 `promise` 处于 rejected 后被调用，首个参数为 `promise` 的 reason
   2. 它在 `promise` 处于 rejected 前必须不被调用
   3. 它必须不能被调用超过一次
4. `onFulfilled` 或 `onRejected` 只能在[执行上下文](https://es5.github.io/#x10.3)栈只包含平台代码时才能调用[注：1](#note-1)
5. `onFulfilled` 与 `onRejected` 只能作为函数调用（如：没有 `this` 值）[注：2](#note-2)
6. 同一个 promise 的 `then` 可以被调用多次
   1. 如果|当 `promise` 处于 fulfilled 状态，所有 `onFulfilled` 回调必须按照他们最初调用 `then` 的顺序执行
   2. 如果|当 `promise` 处于 rejected 状态，所有 `onRejected` 回调必须按照他们最初调用 `then` 的顺序执行
7. `then` 必须返回一个 promise[注：3](#note-3)
   ```js
   promise2 = promise1.then(onFulfilled, onRejected);
   ```
   1. 如果 `onFulfilled` 或 `onRejected` 返回了值 `x`，执行 Promise 决议流程（Promise Resolution Procedure）`[[Resolve]](promise2, x)`
   2. 如果 `onFulfilled` 或 `onRejected` 抛出了一个异常 `e`，`promise2` 必须将 `e` 作为 reason 进入 rejected 状态
   3. 若 `onFulfilled` 不是函数且 `promise1` 处于 fulfilled 状态，`promise2` 必须 fulfilled 且与 `promise1` 有相同的 value
   4. 若 `onRejected` 不是函数且 `promise1` 处于 rejected 状态，`promise2` 必须 rejected 且与 `promise1` 有相同的 reason

### Promise 决议流程

Promise 决议流程是一个将 promise 和 value 作为输入的抽象操作，标记为 `[[Resolve]](promise, x)`。若 `x` 是 thenable，它会假定 `x` 的行为至少某种程度上类似一个 promise，并让 `promise` 采用 `x` 的状态。否则，以 value `x` fulfill `promise`

这样处理 thenable 让 promise 的不同实现间相互通用，只要这些实现的 `then` 方法符合 Promises/A+ 规范。这样还可以让 Promises/A+ 的实现 “吸纳” 不合规范的实现中的合理的 `then` 方法。

运行 `[[Resolve]](promise, x)`，执行如下步骤：

1. 若 `promise` 与 `x` 指向同一对象，拒绝 `promise` 并将 reason 设为一个 `TypeError`
2. 若 `x` 是一个 promise，采用如下状态：[注：4](#note-4)
   1. 若 `x` 处于 `pending` 状态，`promise` 必须保持 pending 直至 `x` 转入 fulfilled 或 rejected 状态
   2. 若|当 `x` 处于 fulfilled 状态，将 `promise` 以同样的 value 转入 fulfilled 状态
   3. 若|当 `x` 处于 rejected 状态，将 `promise` 以同样的 reason 转入 rejected 状态
3. 或者，`x` 是一个对象或函数
   1. 将 `then` 赋值为 `x.then`。[注：5](#note-5)
   2. 若获取 `x.then` 属性抛出了异常 `e`，将 `e` 作为 reason 拒绝 `promise`
   3. 若 `then` 是一个函数，以 `x` 为 `this` 的方式调用，首个参数为 `resolvePromise`，第二个参数为 `rejectPromise`
      1. 若|当 `resolvePromise` 被调用并传入 value `y`，执行 `[[Resolve]](promise, y)`
      2. 若|当 `rejectPromise` 被调用并传入 reason `r`，以 `r` 拒绝 `promise`
      3. 若 `resolvePromise` 和 `rejectPromise` 都被调用，或任一个被调用多次，只有首次调用执行后续流程，其它调用均被忽略
      4. 若调用 `then` 过程抛出了异常 `e`
         1. 若 `resolvePromise` 或 `rejectPromise` 已被调用，忽略该异常
         2. 否则，以 `e` 为 reason 拒绝该 `promise`
   4. 若 `then` 不是函数，以 `x` 为 value 将 `promise` 转入 fulfilled
4. 若 `x` 既不是对象也不是函数，以 `x` 为 value 将 `promise` 转入 fulfilled

若 promise 以一个将产生循环 thenable 链的 thenable 兑现，如递归的 `[[Resolve]](promise, thenable)` 最终导致 `[[Resolve]](promise, thenable)` 再次调用，上述的算法将导致无限递归。鼓励但非强制实现能检测此类递归并以一个带有足够信息的 `TypeError` 作为 reason 拒绝该 `promise`。[注：6](#note-6)

## 注

1. <a name="note-1"></a>这里的“平台代码”指引擎、环境以及 promise 的实现代码。在实践中，这个要求确保了 `onFulfilled` 与 `onRejected` 异步执行，在一轮事件循环后 `then` 以一个新的栈被调用。这可以通过宏任务（macro-task）机制，比如 `setTimeout` 或 `setImmediate` 实现；或者使用微任务（micro-task）机制例如 `MutationObserver` 或 `process.nextTick`。由于 promise 实现往往是平台代码，它可能本身包含任务调度队列或“trampoline”调用回调。
2. <a name="note-2"></a>即在严格模式下，函数内的 `this` 为 `undefined`，普通模式下，为全局对象。
3. <a name="note-3"></a>只要满足全部规范，实现上允许 `promise2 === promise1`。每个实现都应提供其是否会产生 `promise2 === promise1` 且在何种情况下产生。
4. <a name="note-4"></a>通常而言，只考虑 `x` 来自当前实现的 `promise`。该条款允许使用特定实现意味着采用一致的 promise 状态
5. <a name="note-5"></a>该过程首先将 `x.then` 保存到某个引用，然后测试该引用，之后调用该引用，以避免多次访问 `x.then` 属性。这种预防措施非常重要：在面对访问器属性时，它们的值可能在重新获取时发生改变。
6. <a name="note-6"></a>实现时不应该为 thenable 链的深度设定随意的限制，然后假定超过该限制的是无限递归。只有真正的无限循环才会导致 `TypeError`；若遇到了不同的 thenable 组成的无限链，此时的无限递归是正常行为。

## 参见

- 原文：[Promises/A+](https://promisesaplus.com/)

