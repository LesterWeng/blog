# 相对路径在 http 中的应用

### 由来

工作中一个项目可能位于三种环境：开发、测试、生产，而项目所部署在的这三个环境的地址可能存在`层级`的差异，为了区分这三种环境，我们可能的做法：

1. 分别对三种环境做区分处理，配置相应的绝对路径，包括各种路径，如 Ajax 的路径，请求的图片、文件等资源的路径等等
2. 考虑使用相对路径

由于第一种方式需要写配置文件对不同环境做规划，较麻烦，不在必要的情况下不建议使用，也就有了本文。

### 使用举例

三种环境下项目所部署的地址分别举例如下：
开发：`http://localhost:8080`
测试：`http://example-test`
生产：`http://website/example-prod`

#### 1.获取资源

`/static/img/logo.png`
`static/img/logo.png(./static/img/logo.png)`
如上例，前者为绝对路径，后者为相对路径，在开发和测试环境下二者没有什么区别，而当部署在生产环境下时，前者写法就会发生错误（404 Not Found）

#### 2.Ajax 请求

`/user/login`
`user/login`
效果同上，使用相对路径可避免出错，需要注意的是若为前后端分离的项目，前后端地址必然不同，此时需要全局给相对路径添加上后台项目地址的前缀，拼成绝对路径，如：`http://backend/announcement` + `user/login`

### html、css、js 中的相对与绝对路径

**相对路径** 相对于该项目（index.html）所部署在的地址,如部署在`http://website/example-prod`，则`user/login`和`static/img/logo.png`分别指向`http://website/example-prod/user/login`、`http://website/example-prod/static/img/logo.png`

**绝对路径** 相对于该项目（index.html）所部署在的地址的'根目录'，同样是部署在`http://website/example-prod`，`/user/login`和`/static/img/logo.png`分别指向`http://website/user/login`、`http://website/static/img/logo.png`
