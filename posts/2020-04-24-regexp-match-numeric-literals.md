---
title: 正则表达式匹配 JavaScript 数字字面量（Numeric Literals）
date: 2020-04-24T21:09:46
tags:
  - 正则表达式
  - 字面量
---

- [背景](#%e8%83%8c%e6%99%af)
- [解法](#%e8%a7%a3%e6%b3%95)
  - [匹配十进制字面量（DecimalLiteral）](#%e5%8c%b9%e9%85%8d%e5%8d%81%e8%bf%9b%e5%88%b6%e5%ad%97%e9%9d%a2%e9%87%8fdecimalliteral)
    - [匹配 DecimalIntegerLiteral](#%e5%8c%b9%e9%85%8d-decimalintegerliteral)
      - [小结](#%e5%b0%8f%e7%bb%93)
    - [匹配 DecimalDigits](#%e5%8c%b9%e9%85%8d-decimaldigits)
      - [小结](#%e5%b0%8f%e7%bb%93-1)
    - [匹配 ExponentPart](#%e5%8c%b9%e9%85%8d-exponentpart)
      - [小结](#%e5%b0%8f%e7%bb%93-2)
    - [小结](#%e5%b0%8f%e7%bb%93-3)
  - [匹配二进制整型字面量（BinaryIntegerLiteral）](#%e5%8c%b9%e9%85%8d%e4%ba%8c%e8%bf%9b%e5%88%b6%e6%95%b4%e5%9e%8b%e5%ad%97%e9%9d%a2%e9%87%8fbinaryintegerliteral)
  - [匹配八进制整型字面量（OctalIntegerLiteral）](#%e5%8c%b9%e9%85%8d%e5%85%ab%e8%bf%9b%e5%88%b6%e6%95%b4%e5%9e%8b%e5%ad%97%e9%9d%a2%e9%87%8foctalintegerliteral)
  - [匹配十六进制整型字面量（HexIntegerLiteral）](#%e5%8c%b9%e9%85%8d%e5%8d%81%e5%85%ad%e8%bf%9b%e5%88%b6%e6%95%b4%e5%9e%8b%e5%ad%97%e9%9d%a2%e9%87%8fhexintegerliteral)
  - [答案](#%e7%ad%94%e6%a1%88)
- [验证](#%e9%aa%8c%e8%af%81)
- [参见](#%e5%8f%82%e8%a7%81)

## 背景

写一个能匹配 JavaScript 数字字面量（Numeric Literals）的正则表达式

## 解法

这个问题的第一点是 —— JavaScript 有哪些数字字面量？

JavaScript 标准是 [ECMA-262](http://ecma-international.org/publications/standards/Ecma-262.htm)。标准的 [11.8](http://ecma-international.org/ecma-262/10.0/index.html#sec-ecmascript-language-lexical-grammar-literals) 节定义了字面量，[11.8.3](http://ecma-international.org/ecma-262/10.0/index.html#sec-literals-numeric-literals) 定义了数字字面量

当前，数字字面量共有四种类型，分别为：
- 十进制字面量（DecimalLiteral）
- 二进制整型字面量（BinaryIntegerLiteral）
- 八进制整型字面量（OctalIntegerLiteral）
- 十六进制整型字面量（HexIntegerLiteral）

依次编写这四种类型的字面量，合起来便能得到数字字面量

### 匹配十进制字面量（DecimalLiteral）

依据标准，十进制字面量有三种写法：

- DecimalIntegerLiteral . DecimalDigits<sub>opt</sub> ExponentPart<sub>opt</sub>
- . DecimalDigits ExponentPart<sub>opt</sub>
- DecimalIntegerLiteral ExponentPart<sub>opt</sub>

这三种写法由四个部分组成，分别为

- `.`
- `DecimalIntegerLiteral`
- `DecimalDigits`
- `ExponentPart`

#### 匹配 DecimalIntegerLiteral

DecimalIntegerLiteral 有两种写法：

- 0
- NonZeroDigit DecimalDigits<sub>opt</sub>

这两种写法由三个部分组成，分别为

- `0`
- `NonZeroDigit`
- `DecimalDigits`

NonZeroDigit，值为 `1` `2` `3` `4` `5` `6` `7` `8` `9`  之一，正则为 `[1-9]`

##### 小结

DecimalDigits 的正则为 `\d+`（推导见下一节），因此，NonZeroDigit DecimalDigits<sub>opt</sub> 的正则表达式为 `[1-9]\d*`

可知 DecimalIntegerLiteral 的正则为 `0|[1-9]\d*`

#### 匹配 DecimalDigits

DecimalDigits 有两种写法：

- DecimalDigit
- DecimalDigits DecimalDigit

DecimalDigit，值为 `0` `1` `2` `3` `4` `5` `6` `7` `8` `9` 之一，正则为 `[0-9]`，即 `\d`

##### 小结

可以看到，DecimalDigits 是一次或多次的 DecimalDigit，因此正则为 `\d+`

#### 匹配 ExponentPart

ExponentPart 只有一种写法
- ExponentIndicator SignedInteger

ExponentIndicator 值为 `e` 或 `E`，正则为 `e|E`

SignedInteger 写法为

- `DecimalDigits`
- `+ DecimalDigits`
- `- DecimalDigits`

正则为 `(\+|\-){0,1}\d+`

##### 小结

因此 ExponentPart 的正则为 `(e|E)(\+|\-){0,1}\d+`

#### 小结

因此，十进制字面量三种写法对应正则：

- DecimalIntegerLiteral . DecimalDigits<sub>opt</sub> ExponentPart<sub>opt</sub> 正则为：`(0|[1-9]\d*)\.\d*((e|E)(\+|\-){0,1}\d+)*`
- . DecimalDigits ExponentPart<sub>opt</sub> 正则为：`\.\d+((e|E)(\+|\-){0,1}\d+)*`
- DecimalIntegerLiteral ExponentPart<sub>opt</sub> 正则为：`(0|[1-9]\d*)((e|E)(\+|\-){0,1}\d+)*`

综上，十进制字面量正则为：`((0|[1-9]\d*)\.\d*((e|E)(\+|\-){0,1}\d+)*)|(\.\d+((e|E)(\+|\-){0,1}\d+)*)|((0|[1-9]\d*)((e|E)(\+|\-){0,1}\d+)*)`

### 匹配二进制整型字面量（BinaryIntegerLiteral）

二进制整型字面量有两种写法

- 0b BinaryDigits
- 0B BinaryDigits

匹配 BinaryDigits 的写法为

- BinaryDigit
- BinaryDigits BinaryDigit

BinaryDigit 值为 `0` 或 `1`，正则为：`0|1`

BinaryDigits 正则为：`(0|1)+`

综上，二进制整型字面量正则为：`0(b|B)(0|1)+`

### 匹配八进制整型字面量（OctalIntegerLiteral）

八进制整型字面量有两种写法

- 0o OctalDigits 
- 0O OctalDigits

OctalDigits 有两种写法：

- OctalDigit
- OctalDigits OctalDigit

OctalDigit 值为：`0` `1` `2` `3` `4` `5` `6` `7`，正则为：`[0-7]`

OctalDigits 正则为：`[0-7]+`

综上，八进制整型字面量正则为：`0(o|O)[0-7]+`

### 匹配十六进制整型字面量（HexIntegerLiteral）

十六进制整型字面量有两种写法：

- 0x HexDigits 
- 0X HexDigits

HexDigits 有两种写法：

- HexDigit
- HexDigits HexDigit

HexDigit 值为：`0` `1` `2` `3` `4` `5` `6` `7` `8` `9` `a` `b` `c` `d` `e` `f` `A` `B` `C` `D` `E` `F`，正则为：`[0-9a-fA-F]`

HexDigits 正则为：`[0-9a-fA-F]+`

综上，十六进制整型字面量正则为：`0(x|X)[0-9a-fA-F]+`

### 答案

综上，数字字面量的正则表达式为：`(((0|[1-9]\d*)\.\d*((e|E)(\+|\-){0,1}\d+)*)|(\.\d+((e|E)(\+|\-){0,1}\d+)*)|((0|[1-9]\d*)((e|E)(\+|\-){0,1}\d+)*))|(0(b|B)(0|1)+)|(0(o|O)[0-7]+)|(0(x|X)[0-9a-fA-F]+)`

限制从开始至结束的 JavaScript 正则字面量为：

`/^((((0|[1-9]\d*)\.\d*((e|E)(\+|\-){0,1}\d+)*)|(\.\d+((e|E)(\+|\-){0,1}\d+)*)|((0|[1-9]\d*)((e|E)(\+|\-){0,1}\d+)*))|(0(b|B)(0|1)+)|(0(o|O)[0-7]+)|(0(x|X)[0-9a-fA-F]+))$/`

## 验证

## 参见

- [ECMA-262 11.8.3 Numeric Literals](http://ecma-international.org/ecma-262/10.0/index.html#sec-literals-numeric-literals)
- [正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
- [test262 numeric literals](https://github.com/tc39/test262/tree/master/test/language/literals/numeric)








