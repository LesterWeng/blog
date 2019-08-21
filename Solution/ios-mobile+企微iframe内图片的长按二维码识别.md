# ios-mobile+企微 iframe 内图片的长按二维码识别

### 由来

工作中遇到个需求，企微内页面包含 iframe，iframe 内包含有二维码图片，要求长按 iframe 内的二维码图片能够弹出企业微信的带有识别二维码选项的操作框（PS：如果是企微内直接子页面中的二维码图片，直接长按即可弹出操作框，同时在安卓中 iframe 内部的二维码图片长按也可以直接弹出操作框）。

### 解决方案

长按 iframe 内图片时，将图片地址 post 到父页面，父页面即时展示几乎透明的全屏大图，即可达到长按父页面图片的效果，注意长按结束后将图片地址置空，以防止对下次长按操作造成影响。
这种方法适用于所有希望子 iframe 页面元素能够响应父页面事件的需求。

```
iframe页面内：
<script>
document.addEventListener('touchstart', e => {
    if(e.target.nodeName === 'IMG'){
        window.parent.postMessage(e.target.src, '*');
    }
})
document.addEventListener('touchend', e => {
    if(e.target.nodeName === 'IMG'){
        window.parent.postMessage('', '*');
    }
})
</script>

父页面内(Vue)：
<template>
  <img v-show="imageUrl" class="qrImg" :src="imageUrl">
</template>
<script>
window.addEventListener("message", e => {
    this.imageUrl = e.data;
});
</script>
<style>
.qrImg {
  height: 100%;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  opacity: 0.001;
}
</style>
```
