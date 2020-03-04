## Vue 实例初始化过程分析

Vue 定义时通过各种 Mixin 方法(如 initMixin/stateMixin/lifecycleMixin...) 将

内部方法(如\_init/\_update/\_render...) 和

接口方法(如\$nextTick/\$set/\$watch...)

挂载到 Vue.prototype 上

new Vue()，Vue Constructor 中调用\_init，根据传入的 options 对象 进行初始化

->

通过各种 Init 方法(如 initLifecycle/initEvents/initRender...) 将

内部属性(如\_watcher/\_inactive/\_isMounted...) 和

接口属性(如\$parent/\$root/\$children...

挂载到 Vue 实例 vm 上

过程中对 options 中各种 state 数据(包括 props/data/computed/methods/watch)进行了初始化处理

若指定了 el 属性，则直接调用\$mount 进行渲染，否则直至用户手动调用\$mount 才进行渲染

->
