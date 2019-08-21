# ios-mobile 包含 iframe 的页面滚动

### 由来

工作中遇到个需求，移动端页面中，包含不可滚动的 iframe（设置了`scrolling="no"`，`width: 父容器实际宽度, height: iframe实际内容高度`），要求整个页面可上下滚动。

接到需求的第一反应，iframe 内外属于两个页面，在 iframe 的滑动操作无法滚动父页面。经测试后发现，Android 页面中可直接滚动，不受影响，而在 IOS 页面中，滑动 iframe 区域无法触发滚动。

### 解决方案

```
---html
<body>
    <iframe scrolling="no">
    </iframe>
</body>

---scss
    body{
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch; /*关键所在*/
    }

---js
const iframe = iframeWrapper.querySelector('iframe');
iframe.width = iframe.parentElement.offsetWidth;
iframe.onload = () => {
    iframe.height = iframe.contentWindow.document.documentElement.scrollHeight;
}
```

### 总结

PC 端和 Android 在 iframe 区域内部滚动都没有问题，应该只是 IOS 兼容问题。
