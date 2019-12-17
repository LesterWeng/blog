# CSS-BFC 理解

### 定义

块格式化上下文（Block Formatting Context，BFC）  是 Web 页面的可视化 CSS 渲染的一部分，是布局过程中生成块级盒子的区域，也是浮动元素与其他元素的交互限定区域。

### 触发条件

- 根元素(指 html,body 并非 BFC)
- positon: absolute/fixed
- display: inline-block / table / table-cell...
- float 元素
- ovevflow !== visible 并且该值没有传播到 viewport(except when that value has been propagated to the viewport)
  - 传播举例：
    1. body 设置宽度和背景色，发现背景色传递到了视口
    2. body 设置 width:300px、height:300px，当视口高度小于 300px 时,视口出现滚动条，此时若给 body/html 设置 overflow:scroll 会发现没有出现新的滚动条，因为它们的设置传播到了视口，只有当 html、body 都设置 overflow:scroll 才会出现双滚动条，也就是说这样阻止了传播，这便可解释为什么给 body 设置 overflow 无法生成 BFC 的现象

### 规则

- 属于同一个 BFC 的两个相邻 Box 垂直排列
- 属于同一个 BFC 的两个相邻 Box（包括兄弟/父子 Box）的 margin（垂直方向上，不考虑 writing-mode 的改变） 会发生重叠
- BFC 中子元素的 margin box 的左边， 与包含块 (BFC) border box 的左边相接触 (子元素 absolute 除外)
- BFC 的区域不会与 float 的元素区域重叠（非 BFC 的区域中的文字也不会与其重叠，而是环绕在其周围）
- 计算 BFC 的高度时，浮动子元素也参与计算

### 应用

- 阻止 margin 重叠
  - 兄弟 Box 间
  - 父子 Box 间 - margin 塌陷
- 可以包含浮动元素
- 自适应两栏布局
- 可以阻止元素被浮动元素覆盖
