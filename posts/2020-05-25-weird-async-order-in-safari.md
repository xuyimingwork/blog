---
title: Safari 中奇怪的 async + promise 执行顺序
date: 2020-05-25T13:49:24
tags:
  - promise 执行顺序
---

```js
async function aFunc() {
  console.log('2');
}

(async () => {
  console.log('1');
  await aFunc();
  console.log('4')
})()

new Promise(function (resolve) {
    console.log('3');
    resolve();
}).then(function () {
    console.log('5');
});
```

上述代码在 Chrome、Firefox、Node 中输出为 `12345`，然而在 Safari 中输出为 `12354`

但是如果去掉 `aFunc` 前的 `async`，则 Safari 中就能得到正常的顺序 `12345`。

## 另见

- [async/await 在chrome 环境和 node 环境的 执行结果不一致，求解？](https://www.zhihu.com/question/268007969)
