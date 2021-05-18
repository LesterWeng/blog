# React-流程概览

> 本文:
> 默认读者已掌握`Fiber`架构原理；
> 只讨论同步模式(`legacy`)的情况，不关注调度器`scheduler`相关处理

### 整体流程

应用`mount`：调用`ReactDOM.render()`，调用`createContainer`创建`FiberRootNode`(即为 root)、`RootFiber`，调用`updateContainer`从 root 开始调度更新(`scheduleUpdateOnFiber`)。之后，分别进行`render`阶段`mount`时的流程和`commit`阶段的流程

应用`update`：进行`render`阶段`update`时的流程和`commit`阶段的流程

下面详细介绍`render`阶段`和`commit`阶段的流程

### render 阶段

> 即调和器`reconciler`工作阶段

##### mount 时

##### update 时

### commit 阶段

> 即渲染器`renderer`工作阶段
