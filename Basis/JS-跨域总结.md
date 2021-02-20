# 跨域总结

## 何为跨域

在介绍何为跨域之前，我们需要先理解一个概念 **同源策略**

同源策略是浏览器的一个安全策略，它限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互，满足以下条件即为同源：

1. 协议相同 (`http` & `https`)
2. 域名相同 (`http://www.a.com` & `http://www.b.com`)
3. 端口相同 (`http://www.a.com` & `http://www.a.com:8080`)

同源策略的限制范围如下(不同源之间)：

1. cookie、localStorage、indexDb 无法读取
2. DOM 无法获取
3. AJAX 请求不能发送

到这里，我们知道了何为跨域，**跨域**就是由于同源策略的限制而导致的不同源之间无法正常交互的现象

## 请求跨域

### 何为 AJAX

1. AJAX(Asynchronous JavaScript + XML，异步的 JS 和 XML) ，目前我们一般用 JSON 代替 XML。
2. AJAX 主要用于在不刷新页面的情况下向浏览器发起请求并接受响应，最后局部更新页面。
3. 该技术最核心概念是 `XMLHttpRequest` API，该对象可发起 HTTP 请求，我们可以监听其 readystate 的变化获得响应。此外还有新的 `Fetch` API
4. 优点是无刷新请求。
5. 缺点是被浏览器限制不能跨域，解决办法是 `CORS` 或 `JSONP`了

### 何为 CORS

1. CORS(cross origin resource sharing，跨域资源共享)，CORS 需要浏览器和服务器同时支持。目前所有浏览器都支持该功能，IE 浏览器不能低于 IE10；只要服务器实现了 CORS 接口，就可以跨域通信
2. 该技术通过在目标域名返回 CORS 响应头来达到获取该域名的数据的目的
3. 该技术核心就是设置 response header，分为简单请求和复杂请求两种
4. 简单请求只需要设置 `Access-Control-Allow-Origin: 目标源` 即可；复杂请求(非简单请求)则分两步走，第一步是浏览器发起预请求，第二步才是真实请求，预请求需要把服务器支持的请求类型通过响应头来表明，如 `Access-Control-Allow-Methods: POST, GET, OPTIONS`
   1. 预请求(OPTIONS)：预请求无法携带**自定义 header**
      - chrome 中默认不显示 OPTIONS 预请求，访问`chrome://flags/#out-of-blink-cors`将其设置为 disabled 即可
   2. 非简单请求：普通请求即为简单请求，而当请求符合某些条件时，将变为非简单请求，条件如下
      - 请求方法不为 GET，POST，HEAD
      - content-type 不为 application/x-www-form-urlencoded，multipart/form-data， text/plain
      - 有自定义 header
5. 其他重要的响应头：
   1. `Access-Control-Allow-Credentials: true`，设置是否接受请求中的 `Cookie`
   2. `Access-Control-Allow-Headers: 'token'`，设置允许自定义 requestHeader 字段
   3. `Access-Control-Expose-Headers: 'token'`，设置允许前端获取 responseHeaders 自定义数据
6. 优点是配置简单
7. 缺点是某些古老浏览器不支持 CORS 或不支持 Credentials，解决办法是用 JSONP 或后台转发彻底解决跨域问题

### 何为 JSONP(json with padding)

基本思想是网页通过添加一个`<script>`元素，请求 `text/javascript` 类型数据（只能发 GET 请求），这种做法不受同源策略的限制，服务器收到请求后，返回包含回调函数(参数)的 js，浏览器执行 js 调用定义好的全局函数。如下例：

前端

```html
<script type="text/javascript">
  function cb(data) {
    //处理获得的数据
  }
</script>
<script src="http://example.com/api?callback=cb"></script>
```

后台(egg.js)

```js
const { ctx } = this
ctx.set('content-type', 'text/javascript')
ctx.body = ctx.query.callback + '("hello")'
```

> WebSocket 是一种通信协议，使用 ws://（非加密）和 wss://（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信

## 数据跨域

如果两个网页存在跨域，它们无法进行正常的数据交互，解决方案：

1.  设置 document.domain 使两个网页的**域**相同，举个栗子，两个网页分别如下：

    A 网页：`http://a.ccc.com`，documentA

    B 网页：`http://b.ccc.com`，documentB

    正常情况两网页跨域，无法访问对方的 document，而当我们分别设置 `documentA.domain = "ccc.com"; documentB.domain = "ccc.com"`之后，发现两个网页可以互相访问对方的 document 了，因为两个网页的域已经相等了，不存在跨域了

    需要注意的是, document.domain 是不能乱设置的，是有条件的：只能设置为当前域或当前域的**父域**且至少有一个**.**，还是上面的栗子，`http://a.ccc.com`中 com 为一级域名（顶级），ccc 为二级域名，a 为三级域名，所以这个网页的 docuemnt.domain 仅可以设置为`ccc.com`

2.  网页存在跨域时，可以访问到其 window 对象，从而再通过 window.postMessage 接口即可实现两个网页间数据的交互

    - window 获取方式
      - `window.open`
      - `window.opener`
      - `HTMLIFrameElement.prototype.contentWindow`
      - `window.parent`
      - `window.frames[index]`，window.frames 返回一个**类数组对象**
    - postMessage，举例如下：

      ```js
      // A页面
      const receiver = document.getElementById(
        'receiver',
      ).contentWindow
      receiver.postMessage('Hello', 'http:B')

      // B页面
      window.addEventListener(
        'message',
        (event) => {
          // event.data 消息
          // event.origin 消息来源地址
          // event.source 源 Window 对象
        },
        false,
      )
      ```

3.  通过 location.hash 传递数据

    - 父页面可以对 iframe 进行 URL 读写，可以直接给 iframe 页面设置 hash，iframe 页面内通过监听 hash 的改变(onhashchange)来获取数据
    - iframe 无法对父页面 URL 进行设置，iframe 页面可添加一个隐藏的 iframe，作为代理 iframe，地址位于父域名之下，如`http://a.ccc.com/proxy.html`，iframe 页面设置代理页面的 hash，代理页面内监听 hash 的改变，由于代理页面和父页面不存在跨域，当 hash 改变时就可以设置父页面的 hash(`parent.parent.location.hash = xxx`)，从而达到传递数据的目的

4.  通过 window.name 传递数据

    - window 对象有个 name 属性，该属性有个特征：即在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个 window.name 的，每个页面对 window.name 都有读写的权限，window.name 是持久存在一个窗口载入过的所有页面中的，并不会因新页面的载入而进行重置。
