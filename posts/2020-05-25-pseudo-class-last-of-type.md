---
title: 伪类选择器 :last-of-type 中的 type 指的是什么
date: 2020-05-25T09:08:27
tags:
  - CSS
---

`:last-of-type` 表示该元素为同类型兄弟元素中的最后一个，type 指的是文档树中元素的类型。如：`<img>` 元素的类型为 img。

该选择器属于：简单选择器 => 伪类选择器 => [结构型伪类选择器](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)。

此外，显然，简单选择器中的[类型选择器（Type selector）](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#type-selectors)，其类型指的也是元素的类型。

## 参见

- [:last-of-type 伪类选择器](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#last-of-type-pseudo)