---
title: decodeURI('%') 为什么会报错
date: 2020-05-25T14:18:52
tags:
  - decodeURI
  - decodeURIComponent
  - URIError
---

不论是执行 `decodeURI('%')` 又或是执行 `decodeURIComponent('%')`，都会抛出 `URIError` 的异常。

事实上，这类似于解析到了半个字符而报错，如执行 `'\u'`，报 `SyntaxError`，但执行 `'\u0000'` 不会报错一个道理。

在 String 眼中，`\u0000` 表示一个字符，而 `\u` 是不完整的“半个”字符。同样在 decodeURI 眼中，`%` 是“半个”字符，`%5D` 才是完整的字符。

下面是 `encodeURI` 与码点间的关系：

```js
encodeURI(']') // => "%5D"
']'.codePointAt(0).toString(16) // => "5d"
'\u005d' // => "]"
```


