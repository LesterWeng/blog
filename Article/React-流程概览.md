# React-流程概览

> 本文:
> 默认读者已了解`Fiber`架构原理；
> 只讨论同步模式(`legacy`)的情况，不关注调度器`scheduler`相关处理；
> 主要考虑类型为`FunctionComponent`、`HostComponent`的情况；
> 缩写：`wip`指`workInProgress`,`FC`指`FunctionComponent`；

### 整体流程

> `render`阶段：调和器`reconciler`工作阶段；
> `commit`阶段：渲染器`renderer`工作阶段

`mount`时：调用`ReactDOM.render()`开始渲染，调用`createContainer`创建`FiberRootNode`(即为 root)、`RootFiber`，调用`updateContainer -> scheduleUpdateOnFiber`从 root 开始调度更新(`scheduleSyncCallback(performSyncWorkOnRoot)`)，包括`render`阶段`mount`时的流程和`commit`阶段的流程

`update`时：调用`dispatchAction()`触发更新，最终和`mount`时相同，也调用`scheduleUpdateOnFiber`开始调度更新，包括`render`阶段`update`时的流程和`commit`阶段的流程

下面分别介绍`render`阶段和`commit`阶段的流程：

### render 阶段

`render` 阶段包括若干个`beginWork`、`completeWork`过程，可分别理解为自上而下的`递`与`归`的过程(执行过程与`深度优先遍历`相同，或者说是树的`先序遍历`)，先从`fiber树`顶开始`递`到底，后从`fiber树`底开始`归`到顶

#### mount 时

`beginWork`过程，根据`ReactElement`(`wip.tag=FC`时，由`Component()`函数返回；`wip.tag=HostComponent`时，从`pendingProps.children`获取)，经过`reconcileChildren`(即`diff`，根据新生成的`child ReactElement`与`child current fiber`对比)生成一个新的`child wip fiber`，之后以新的`child wip fiber`为当前`wip fiber`继续`beginWork`过程。
所有自上而下的`beginWork`的执行过程中仅有一个`wip fiber`存在`current`，即`rootFiber`，其会执行下面 update 时的流程，给其打上`Placement`的`effect tag`

`completeWork`过程，会为当前`wip fiber`创建对应的`dom`节点，之后返回`return fiber`继续`completeWork`过程，最终自下而上生成一棵完整的`dom`树，结合上面打了`Placement effect tag`的`rooFiber`，在`commit`阶段就完成了首次的渲染

#### update 时

> 更新时与`fiber.lanes`有很大关联，`lane`相关请查看[React-lane 解析](./React-lane解析.md)
> 此时的`current fiber`是`上次`的`wip fiber`，而`wip fiber`其实是`上上次`的`wip fiber`，当`beginWork`完成后，`wip fiber`才真正变成`这次`的`wip fiber`，不要被绕晕哦 :）

`beginWork`过程，若`current fiber`存在，则根据当前的`wip fiber`、`current fiber`的新旧`props`以及`wip fiber.lanes`来判断是否可以复用(`bailoutOnAlreadyFinishedWork`)，否则即为不可复用

- 若当前`fiber`可复用但子`fiber`有需要进行的工作(`fiber.childLanes`)，则调用`cloneChildFibers`根据`child.pendingProps`、复用的当前`child wip fiber`，以及当前`child current fiber`上需要继承的属性(如`flags、lanes、child、sibling、memoizedProps、memoizedState、updateQueue`等等)通过`createWorkInProgress`生成一个新的`child wip fiber`(更新原`child wip fiber`)；若子`fiber`没有需要进行的工作，则直接复用当前`wip fiber`且返回`null`停止遍历
- 若不可复用，则进行`diff`，在`diff`过程中再次判断是否可复用
  - 若可复用则依次调用`useFiber -> createWorkInProgress`生成一个新的`child wip fiber`
  - 否则进行`增/删`fiber 操作
  - `diff`完成后会生成一个新的`child wip fiber`，过程中，会为`wip fiber`打上相应的`effect tag`
- 同`mount`时相同，若新生成的`child wip fiber !== null`，之后会以新的`child wip fiber`为当前`wip fiber`继续`beginWork`过程

`completeWork`过程，会处理当前`tag=HostComponent`的`wip fiber`的`props`，生成包含更新`props`的`wip fiber.updateQueue`(结构为`[key1, value1, key2, value2]`)，同样会返回`return fiber`继续`completeWork`过程

### commit 阶段

可大体分为 3 个子过程：`commitBeforeMutationEffects`、`commitMutationEffects`、`commitLayoutEffects`，3 个过程都使用`深度优先遍历`的方式遍历`wip fiber树`

此外，3 个子过程结束后，会切换`wip rootFiber`(`root.current = finishedWork`)，然后等待`组件渲染完毕`后执行`flushSyncCallbacks`立即执行`syncQueue`内的更新(包括`useLayoutEffect`回调内触发的更新)

#### commitBeforeMutationEffects

在`DOM`操作前，进行需要的准备工作，如删除元素后是否需要`focus`/`blur`等

#### commitMutationEffects

根据`fiber.deletions、fiber.flags`进行对应的`DOM`操作，之后重置这 2 个标记

- 当`fiber.child`或`child.sibling`为`FC`且在`fiber.deletion`内时，调用`FC`的`updateQueue`内所有的`effect hook`回调返回的清理函数
- 当遍历到`FC`时，会沿着`fiber.updateQueue`上的`effect hook单向链表`进行相关的处理：若当前`FC`包含`PlacementAndUpdate | Update`的`flag` 且当前`effect hook`包含`HookLayout | HookHasEffect`的`flag`，则执行`useEffect、useLayoutEffect`上次的回调返回的清理函数
- 此过程结束后会使用`root.current = finishedWork`切换应用的`wip rootFiber`，原来的`current rootFiber`就变成了下次调度时的`wip rootFiber`

#### commitLayoutEffects

- 当遍历到`FC`时，会沿着`fiber.updateQueue`上的`effect hook单向链表`进行相关的处理：若当前`effect hook`包含`HookLayout | HookHasEffect`的`flag`，则执行`useEffect、useLayoutEffect`的回调

> 与`HookLayout | HookHasEffect`的`flag`相关联的`useEffect、useLayoutEffect`hooks 请移步[React-hooks 解析](./React-hooks解析.md)

<!-- TODO:PassiveEffect -->
<!-- 同样，当遍历到`FC`时，会沿着`fiber.updateQueue`上的`effect hook单向链表`进行相关的处理:

- 若当前`effect hook`包含`HookPassive | HookHasEffect`的`flag`，则执行`useEffect、useLayoutEffect`上次的清理函数
- 若当前`effect hook`包含`HookPassive | HookHasEffect`的`flag`，则执行`useEffect、useLayoutEffect`这次的回调 -->
