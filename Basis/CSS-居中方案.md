# CSS-居中方案

### 行内元素

1. 一般

   - text-align: center, line-height: height, vertical-align: middle(实际并没有完全垂直居中，仅仅是中间与字母`x`基线对齐了，可通过 vertical-align: n px 继续进行调整)

2. 父级 flex

   - justify-content: center + align-items: center

### 块级元素

1. 父级 flex

   - justify-content: center + align-items: center

2. margin auto

   - margin 默认值为 0，具备流体特性的水平盒子上，当设置 margin-left: auto 时，左边距大小实际就是 剩余空间 - margin-right(0)，也就实现了右对齐，而当设置 margin: 0 auto 则会平分剩余空间，就实现了水平居中
   - 垂直方向上不存在流体特性，无法自动分配剩余空间，但当 position: absolute 且两个方向都进行了定位时，该盒子便具备了流体特性，因此此时再做 margin auto 设置即可达到居中效果

   ```scss
   div {
     position: absolute;
     top: 0;
     bottom: 0;
     margin: auto 0;
   }
   ```

3. '负边距'

   - left、margin、padding 百分比相对于父级，但 padding 不能为负值，transform 百分比相对于自身，据此，我们可以设置 left/margin 其中一个为 50%使盒子左边对齐父级 50%宽处，再设置另一个或 transform 为负 50%自身宽度使盒子居中，垂直居中同理（注意 margin-top/bottom 百分比是相对于父级元素的 width）

   ```scss
   div {
     width: 100px;

     position: relative;
     left: 50%;
     margin-left: -50px;
   }
   div {
     width: 100px;

     position: relative;
     margin-left: 50%;
     left: -50px;
   }
   div {
     width: 100px;

     position: relative;
     padding-left: 50%;
     left: -50px;
   }
   div {
     margin-left: 50%;
     transform: translateX(-50%);
   }
   div {
     position: relative;
     left: 50%;
     transform: translateX(-50%);
   }
   ```

4. 计算左侧/上侧应设置的 margin 大小，进行计算，如 margin-left: calc(50% - 50px)
