# JS-事件

## DOM0 级事件

> 指使用如下方式绑定的事件

绑定：`html` 内`<input onclick=''>`;`js` 中 `el.onclick=''`

解绑： `el.onclick = null`

阻止：可使用 `return false` 来阻止事件往下执行，也可阻止`默认事件`

## DOM2 级事件

### 三个阶段

当鼠标点击所看到的的按钮时，其实发生了一系列的事件传递，可以想象一下，button 实际上是被 body“包裹”起来的，body 是被 html“包裹”起来的，html 是被 document“包裹”起来的，document 是被 window“包裹”起来的。所以，在你的鼠标点下去的时候，最先获得这个点击的是最外面的 window，然后经过一系列传递才会传到最后的目标 button，当传到 button 的时候，这个事件又会像水底的泡泡一样慢慢往外层穿出，直到 window 结束。

综上，一个事件的传递过程包含三个阶段，分别称为：捕获阶段，目标阶段，冒泡阶段。目标指的就是包裹得最深的那个元素。

冒泡型事件只会发生在事件冒泡阶段，同理捕获型事件只会发生在事件捕获阶段

### 事件

> 指使用`addEventListener`绑定的事件。
> `addEventListener`参数：事件名称、回调函数和事件执行阶段：冒泡阶段(false)、捕获阶段(true)，默认为 false

绑定：`el.addEventListener('', func, bool)`

解绑：`el.removeEventListener( '', func, bool )`。如果定义`捕获`阶段执行的事件，则必须在 `removeEventListener()`中指明是捕获阶段，才能正确地将这个事件处理函数删除

阻止：可使用`event.stopPropagation()`阻止冒泡和捕获阶段的事件(需要注意的是，阻止并不表示其截断了事件从上到下再从下到上的传播，只是阻止了在当前`target`之下的`target`(即`子孙元素`)的`捕获事件`的执行和在当前`target`之`上`(即`祖先元素`)的`target`的`冒泡事件`的执行，这就是为什么绑定在`子元素`上的`冒泡事件`无法在`父元素`上进行阻止的原因)；
可使用`stopImmediatePropagation`阻止冒泡和捕获阶段的事件，和`stopPropagation`的区别是它同时还能阻止该元素的后续相同事件的发生(多个事件监听默认会按顺序执行)；
可使用`event.preventDefault()`阻止默认事件（如果`event`的 `cancelable`为`fasle`则代表其无法阻止）

手动触发：`el.dispatchEvent(event)`

## DOM3 级事件，在 DOM2 级事件的基础上添加了更多的事件类型

UI 事件，当用户与页面上的元素交互时触发，如：load、scroll

焦点事件，当元素获得或失去焦点时触发，如：blur、focus

鼠标事件，当用户通过鼠标在页面执行操作时触发如：dbclick、mouseup

滚轮事件，当使用鼠标滚轮或类似设备时触发，如：mousewheel

文本事件，当在文档中输入文本时触发，如：textInput

键盘事件，当用户通过键盘在页面上执行操作时触发，如：keydown、keypress

合成事件，当为 IME（输入法编辑器）输入字符时触发，如：compositionstart

变动事件，当底层 DOM 结构发生变化时触发，如：DOMsubtreeModified

同时 DOM3 级事件也允许使用者自定义一些事件。
