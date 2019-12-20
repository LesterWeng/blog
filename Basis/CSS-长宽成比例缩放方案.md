# CSS-长宽成比例缩放方案

1. 使用百分比来设置宽高时，由于宽高的百分比不是相对于同一个值，故无法直接进行设置成比例的百分比宽高，但我们可以想个办法让其相对的值相等，如下：
   - 由于 padding 的百分比是相对于父级的宽度，我们设置父级 height: 0，使用 padding-top/padding-bottom 撑起（也可用伪元素来撑开父级），值为按比例计算后的百分比，而子元素（图片）宽高均设置 100%
   - 由于父级高度是由 padding 撑起的，普通定位子元素在计算宽高百分比时不会包括父级的 padding，而绝对定位子元素在计算时则会将其包括在内，我们设置父级元素 position: relative、子元素 position: absolute

```html
<div class="aspectration" data-radio="60:37">
  <img src="" />
</div>
```

```scss
.aspectration {
  position: relative;
  height: 0;

  * {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
.aspectration[data-ratio='60:37'] {
  padding-bottom: calc(37 / 60 * 100%);
}
```

2. 既然宽高的百分比不是相对于同一个值，我们何不选择一个相对的单位，如 rem、vw，只要两个值成比例即可

```scss
.aspectration[data-ratio='60:37'] {
  width: 100vw;
  height: calc(37 / 60 * 100vw);
}
```

3. 借助 postcss aspect-ratio 插件实现（实际使用的是方案 1 的伪元素撑开方式）

```scss
.aspectration {
  position: relative;
  aspect-ratio: '60:37';
}
```
