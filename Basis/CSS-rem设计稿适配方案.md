# CSS-rem 设计稿适配方案

### 完全适配

完全适配指的是页面尺寸（主要是宽度）只要发生变化，使用 rem 作为单位的数值就跟着发生改变，具体设置如下：

- 页面尺寸发生改变时使用 js 修改 html(document.documentElement)的 font-size 从而修改 rem 所对应的的数值
- 这种情况下用于计算的默认 font-size(referenceFontSize)大小可以自定义，原因是设置时与使用时分别对 referenceFontSize 使用乘法、除法，如 100 \* fontSize / fontSize，最终结果不变

```
// js
var docEl = document.documentElement,
referenceWidth = 1920 - 200,
minWidth = 1210,
referenceFontSize = 32;

function setRemUnit() {
docEl.style.fontSize = referenceFontSize * (docEl.clientWidth >= minWidth ? docEl.clientWidth : minWidth) / referenceWidth + 'px';
}

setRemUnit();

// reset rem unit on page resize
window.addEventListener('resize', setRemUnit);
window.addEventListener('pageshow', function(e) {
if (e.persisted) {
    setRemUnit();
}
});
```

### 区段适配

区段适配指的是仅当页面尺寸（主要是宽度）发生区段变化时，使用 rem 作为单位的数值才会跟着发生改变，主要用于 PC 端，具体设置如下：

- 使用 css 媒体查询来设置不同尺寸页面下 html 的 font-size，从而达到区段设置的效果，注意尺寸从大到小的设置要依次从上往下书写(css 优先级)
- 这种情况下 referenceFontSize 与设计稿尺寸所对应区段的 font-size 要保持一致，如设计稿是 1920 \* xxx，下例中我们用于计算的默认 fontSize(\$default-font-size)就是 32px

```
// scss
@media screen and (max-width: 1920px) {
  html {
    font-size: 32px;
  }
}

@media screen and (max-width: 1600px) {
  html {
    font-size: 28px;
  }
}

$default-font-size: 32px;

// translate px to rem
@function px2rem ($px) {
  @return $px / $default-font-size * 1rem;
}
```

最后，px 到 rem 的转换推荐使用 postcss 的 postcss-px2rem 插件，不需要转换的可以使用 `/*no*/` 进行标记，或者使用如上 scss 的 function px2rem 亦可
