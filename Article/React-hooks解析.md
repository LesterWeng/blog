# React-hooks 解析

### useState

`dispatchAction` bind 的`fiber`是固定的，即始终`bind`到`current`、`wip`中的一棵树上，在调用时该`fiber`可能是作为`wip fiber`，也可能作为`current fiber`，而`current fiber`和`wip fiber`，其上的部分属性可能并不一致，如`lanes`

### useEffect

`mount`阶段调用时，给当前`wip fiber`打上`PassiveEffect | PassiveStaticEffect`的`flag`，给`effect hook`打上`HookHasEffect | HookPassive`的`tag`，且`effect.destroy = null`

`update`阶段调用时，给当前`wip fiber`打上`PassiveEffect`的`flag`，给`effect hook`打上`HookHasEffect | HookPassive`的`tag`，且`effect.destroy = hook.memoizedState.destroy`(上次的清理函数)

`useEffect`的回调会在`commit`阶段结束后`异步`执行，即渲染后异步执行，另外需要注意：当`deps`为可变数据时(如`window.location.pathname`等)需要避免在`触发更新后`较快地(`同步`、`微任务`)修改该数据，否则会导致`useEffect`的回调中获取错误的`dep`值

### useLayoutEffect

`mount`阶段调用时，给当前`wip fiber`打上`Update`的`flag`，给`effect hook`打上`HookHasEffect | HookLayout`的`tag`，且`effect.destroy = null`

`update`阶段调用时，给当前`wip fiber`打上`Update`的`flag`，给`effect hook`打上`HookHasEffect | HookLayout`的`tag`，且`effect.destroy = hook.memoizedState.destroy`(上次的清理函数)

`useLayoutEffect`的回调会在`commit`阶段结束后`同步`执行，即渲染后同步执行，若在回调内`触发更新`则会`同步更新UI`，`几乎`看不到`这次更新`导致的页面突变。相对于`useEffect`的回调，当`deps`为可变数据时，`useLayoutEffect`的回调中就不会出现获取错误`dep`值的问题

### useRef

### useCallback

### useMemo
