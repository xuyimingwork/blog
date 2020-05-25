---
title: 从 decodeURI('%') 说起
date: 2020-05-25T14:18:52
tags:
  - decodeURI
  - decodeURIComponent
  - URIError
---

不论是执行 `decodeURI('%')` 又或是执行 `decodeURIComponent('%')`，都会抛出 `URIError` 的异常。

事实上，这类似于解析到了半个字符而报错，如执行 `'\u'`，报 `SyntaxError`，但执行 `\u0000` 不会报错一个道理。

例子：
```js
encodeURI(']') // => "%5D"
']'.codePointAt(0).toString(16) // => "5d"
'\u005d' // => "]"
```


