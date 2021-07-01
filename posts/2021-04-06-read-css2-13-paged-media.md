---
title: 读：CSS 2.1：分页媒体
date: 2021-04-06T20:24:48
tags:
  - CSS
---
## 介绍分页媒体（paged media）

页式媒体（如：纸张、幻灯片、屏幕中展示的纸张等）不同于[连续性媒体](https://www.w3.org/TR/CSS2/media.html#continuous-media-group)，其内容分布在独立的各页面中。

为处理此类情况，CSS 2.1 介绍了如何设置 [page boxes](https://www.w3.org/TR/CSS2/page.html#page-box) 的页边距以及如何声明 [page breaks](https://www.w3.org/TR/CSS2/page.html#page-breaks)

用户代理应该将文档的 page boxes 转换为最终渲染的 sheets，通常 page box 与 sheet 间一一对应，转换包括：

- 将一个 page box 转换为一个 sheet（如：单面打印）
- 将两个 page box 转换到同一个 sheet 的两侧（如：双面打印）
- 将 n 个（小型）page box 转换到一个 sheet 中（学名：n-up）
- 将 1 个（大型）page box 转换到 N * M 个 sheet 中（学名：tiling）
- 创建签名。
- 将一份文档输出到多处
- 输出为文件

## Page boxes: @page 规则

page box 是一个矩形区域，包含一下两个区域：

- 页面区（page area）：即内容区，画布背景位于页面区内且覆盖页面区
- 边距区（margin area）：位于页面区周围，内容透明

CSS 2.1 不指定 page box 的尺寸。

作者可以在 @page 规则下指定 page box 的边距。一个 @page 规则由关键字 "@page"，后接可选的 page selector，后接包含声明与@规则的块组成。@page 与 selector 还有块间可添加空格与注释。位于 @page 规则内的声明还可以被称为位于 page context 中的声明。

> CSS2 的 @page 内暂时不含其它 @规则，这类规则可能会在 CSS3 中定义

page selector 指定声明在哪些页面中生效。在 CSS 2.1 中，可以指定首页，所有左页面或所有右页面。

### 页边距

CSS 2.1 的 [page context](https://www.w3.org/TR/CSS2/page.html#page-context) 只允许 [margin properties](https://www.w3.org/TR/CSS2/box.html#margin-properties)（'margin-top', 'margin-right', 'margin-bottom', 'margin-left', and 'margin'），下图展示了 sheet、page box、page margin 间的关系

![page info](https://www.w3.org/TR/CSS2/images/page-info.png)

下面是一个设置所有 page 所有边距的小例子：

```css
@page {
  margin: 3cm;
}
```

page context 中没有字体的概念，因此不允许 'em' 与 'ex' 单位。边距属性的百分比值是相对于 page box 而言的：左右边距相对于 page box 的宽度，上下边距相对于 page box 的高度。其它单位与其对应的 CSS 2.1 属性均可使用。

因为负边距（不管是在 page box 上的还是在元素上的）或[绝对定位](https://www.w3.org/TR/CSS2/visuren.html#absolute-positioning)可能导致内容位于 page box 之外，这使得这些内容可能被剪裁——被用户代理，被打印机，或者最终受限于纸张而裁切。

### page selector：选择左侧、右侧或首页内容

当进行双面打印时，左页与右页的 page boxes 可能不同。可以在 page selector 通过两个伪类来区分这两者。

用户代理会自动将所有页面分为 `:left` 或 `:right`。首页是 `:left` 或 `:right` 取决于根元素的主要书写方向（major writing direction）：文档的首页是从左到右，则首页为 `:right` 页；文档的首页是从右到左，则首页为 `:left` 页。为强制文档从左页或右页开始，作者可以在首个生成盒前插入 page break

```css
@page :left {
  margin-left: 4cm;
  margin-right: 3cm;
}

@page :right {
  margin-left: 3cm;
  margin-right: 4cm;
}
```

如果对左右侧的 page 做了不同的声明，用户代理必须体现出这种声明，即使无法将 page boxes 转换到左右侧的 sheet（比如打印机只能单页打印）

还可以用 `:first` 伪类指定首页的样式

```css
@page { margin: 2cm } /* All margins set to 2cm */

@page :first {
  margin-top: 10cm    /* Top margin on first page 10cm */
}
```

`:left`、`:right` 内的规则对比没有使用 `:left`、`:right` 具有更高的优先级，`:first` 比 `:left`、`:right` 有更高的优先级。

如果 forced break 发生在首个生成盒前，CSS 2.1 没有定义 `:first` 应用于 break 前的空白页或 break 后的页面。

在左、右、以及首页中定义边距可能导致不同宽度的 page area，为简化实现，用户代理可能会在左、右、首页中使用相同的 page area，在这种情况下，应使用首页的 page area 宽度

### page box 外的内容

在 page 模型中排版内容时，一些内容可能位于当前 page box 之外。例如，某个元素的 `'white-space'` 属性，值为 `'pre'`，导致产生的盒比 page box 更宽。此外，当以绝对或相对方式定位盒子时，它们可能处于“不方便”的位置。例如：图片可能位于 page box 的边缘或在 page box 的 100000 米之下。

本规范不涉及如何排版这些元素。但是，我们希望作者和用户代理在考虑 page box 外的内容时遵循如下原则：

- 内容应该允许适当超出 page box 以达成“出血”（印刷术语）
- 用户代理应避免生成大量空白的 page box 来满足元素定位
- 作者应避免仅为了不打印某个元素，就将其置于“不方便”的位置
- 用户代理可以以多种方式处理位于 page box 外的盒子，包括将其丢弃或在文档的最后为其创建一个 page box

## page breaks

五个属性指明用户代理可以或应该在内容的何处进行分页（分页点），以及后续内容在什么页面（左或右）继续。每个分页点（page break）结束当前 page box 的布局并将文档树的剩余部分在新的 page box 中重新布局。

### 分页属性 `'page-break-before'`、`'page-break-after'`、`'page-break-inside'`

- `'page-break-before'`
  - 值：auto | always | avoid | left | right | inherit
  - 初始值：auto
  - 适用于：块级元素
  - 是否继承：否
  - 百分数：不适用
  - 媒体：可视、分页
  - 计算值：按指定值

- `'page-break-after'`
  - 值：auto | always | avoid | left | right | inherit
  - 初始值：auto
  - 适用于：块级元素
  - 是否继承：否
  - 百分数：不适用
  - 媒体：可视、分页
  - 计算值：按指定值

- `'page-break-after'`
  - 值：avoid | auto | inherit
  - 初始值：auto
  - 适用于：块级元素
  - 是否继承：否
  - 百分数：不适用
  - 媒体：可视、分页
  - 计算值：按指定值

某些属性值意义如下：

- **auto** 既不强制也不禁止在生成的盒前（后、内）进行分页
- **always** 总是强制在生成的盒前（后）进行分页
- **avoid** 避免在生成的盒前（后、内）进行分页
- **left** 强制一或两页在生成的盒前（后）分页，使下一页为左侧页
- **right** 强制一或两页在生成的盒前（后）分页，使下一页为右侧页

允许浏览器将 **left** 和 **right** 视为 **always**

分页点位置通常受父元素的 `'page-break-inside'` 属性、之前元素的 `'page-break-after'` 属性、以及后续元素的 `'page-break-before'` 属性影响。当这些属性的值不是 `auto` 时，`always`、`left`、`right` 优先级比 `avoid` 更高

浏览器需要将这些属性运用到根元素正常流内的块级元素上，当然也可以将这些属性运用到其它元素上，如 `'table-row'` 元素

当一个盒被分页点分开，在分开处盒的外边距、边界、内边距不应有可见的影响

### 在元素内分页 `'orphans'`、`'widows'`

- `'orphans'`
  - 值：\<integer\> | inherit
  - 初始值：2
  - 适用于：块级容器元素
  - 是否继承：是
  - 百分数：不适用
  - 媒体：可视、分页
  - 计算值：按指定值

- `'widows'`
  - 值：\<integer\> | inherit
  - 初始值：2
  - 适用于：块级容器元素
  - 是否继承：是
  - 百分数：不适用
  - 媒体：可视、分页
  - 计算值：按指定值

`'orphans'` 属性定义了页面底部的块级容器内至少需要保留几行。`'widows'` 属性定义了页面顶部的块级容器内至少需要保留几行。

只允许正数。

### 允许的分页点

在正常流中，页面的分页点可以出现在如下位置：

1. 在块级盒垂直方向间的外边距中。当此处发生非强制分页，则 `'margin-top'` 与 `'margin-bottom'` 属性将置为 0。当此处发生强制分页，则 `'margin-bottom'` 属性为 0，`'margin-top'` 可能置为 0 或保留
2. 在块级容器盒内的行盒间
3. 在块级容器盒的内容边缘与子内容外边缘间，如果它们间存在非 0 间隙

这些分页点遵循如下规则：

- 规则A：对于 1，仅在元素的 `'page-break-after'` 和 `'page-break-before'` 值为 always | left | right | auto 时
- 规则B：但是，如果所有均为 auto 且父元素的 `'page-break-inside'` 为 `'avoid'`，则不许作为分页点
- 规则C：对于 2，需要满足 `'orphans'` 与 `'windows'` 的配置
- 规则D：2、3 只在自身与所有父元素的 `'page-break-inside'` 属性值均为 `'auto'` 时生效

如果上述规则未能提供足够的分页点，则忽略 A、B、D 规则以找到更多分页点

若仍未找到足够的分页点，则忽略 C 规则

### 强制的分页点

若 `'page-break-after'` 和 `'page-break-before'` 值为 always | left | right 时，强制插入分页

### 最佳的分页点

CSS 2.1 并没有任何强制规范浏览器必须如何做，但建议：

- 分页点尽可能少
- 除了强制分页点外，其它页面尽可能有相同的高度
- 避免在可替换元素内分页

### 分页中的级联规则

与正常的 CSS 声明一致
