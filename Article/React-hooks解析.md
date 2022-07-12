# React-hooks 解析

`hooks`的出现解决了`FC`内无法使用`状态`的问题，原理是将状态存储在了`FC`对应的`fiber`上，`fiber`上的`hook`会形成一个`单向链表`，`React`根据顺序来确定其对应关系

### useState

`state hook`结构：

```ts
const update: Update<S, A> = {
    lane,
    action,
    eagerReducer: null,
    eagerState: null,
    next: (null: any),
  };
const hook: Hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: {
        pending: update, // update环形链表：4 -> 1 -> 2 -> 3
        interleaved: null,
        lanes: NoLanes,
        dispatch: dispatchAction.bind( // setState
            null,
            currentlyRenderingFiber,
            queue,
        ),
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: (initialState: any),
    },
    next: null, // 单向链表
  };
```

`mount`阶段调用时：

- 生成`state hook`，返回`[hook.memoizedState, dispatch]`

`update`阶段调用时：

- 根据`update`更新`hook`，返回最新的`hook.memoizedState`和原`dispatch`

### useReducer

除书写方式外，均与`useState`相同

### useEffect

`effect hook`结构：

```ts
const hook: Hook = {
    memoizedState: {
      tag,
      create,
      destroy,
      deps,
      next: (null: any), // 环形链表： 4 -> 1 -> 2 -> 3
    },
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null, // 单向链表
  };
```

需要注意的是，`effect`还保存在`fiber.updateQueue`内，如下：

```ts
fiber.updateQueue = {
  lastEffect: {
      tag,
      create,
      destroy,
      deps,
      next: (null: any), // 环形链表： 4 -> 1 -> 2 -> 3
    }
}
```

`mount`阶段调用时：

- 给当前`wip fiber`打上`PassiveEffect | PassiveStaticEffect`的`flag`
- 给生成的`effect hook`打上`HookHasEffect | HookPassive`的`tag`，且`effect.destroy = null`。
- 会在`commit`阶段内的`commitHookEffectListMount`内执行`回调`函数

`update`阶段调用时：

- 若`依赖发生了改变`或`不存在依赖`，会
  - 给当前`wip fiber`打上`PassiveEffect`的`flag`
  - 给`effect hook`打上`HookHasEffect | HookPassive`的`tag`，且`effect.destroy = hook.memoizedState.destroy`(上次的清理函数)
  - 会在`commit`阶段内的`commitHookEffectListUnmount`、`commitHookEffectListMount`内执行`清理`和`回调`函数
- 否则，会只给`effect hook`打上`HookPassive`的`tag`，不会执行`清理`和`回调`函数

注意：`回调`会在`commit`阶段结束后`异步`执行，即渲染后异步执行。因此，当`dep`为可变数据时(如`window.location.pathname`等)，在`触发更新`后较快地(`同步`、`微任务`)修改数据，`useEffect`的回调中获取的`dep`值就会发生改变

### useLayoutEffect

执行过程基本与`useEffect`类似

`mount`阶段调用时：

- 给当前`wip fiber`打上`Update`的`flag`
- 给`effect hook`打上`HookHasEffect | HookLayout`的`tag`，且`effect.destroy = null`。
- 会在`commit`阶段内的`commitHookEffectListMount`内执行`回调`函数

`update`阶段调用时：

- 若`依赖发生了改变`或`不存在依赖`，会
  - 给当前`wip fiber`打上`Update`的`flag`
  - 给`effect hook`打上`HookHasEffect | HookLayout`的`tag`，且`effect.destroy = hook.memoizedState.destroy`(上次的清理函数)
  - 会在`commit`阶段内的`commitHookEffectListUnmount`、`commitHookEffectListMount`内执行`清理`和`回调`函数
- 否则，会只给`effect hook`打上`HookLayout`的`tag`，不会执行`清理`和`回调`函数

注意：`useLayoutEffect`的回调会在`commit`阶段结束后`同步`执行，会阻塞渲染(`若打debugger会发现页面已渲染完毕，原因是debugger打断了JS引擎而未打断渲染引擎`)。相对于`useEffect`的回调，当`deps`为可变数据时，`useLayoutEffect`的回调中不会出现获取的`dep`值发生改变的情况

### useRef

始终返回指定的`ref.current`数据

### useCallback

`mount`阶段调用时：返回上次的`callback`

`update`阶段调用时：

- 若前后`deps`未变化，不使用传入的函数，直接返回上次的`callback`
- 否则，使用传入的函数返回一个新`callback`

### useMemo

`mount`阶段调用时：返回上次的`callback() 返回值`

`update`阶段调用时：

- 若前后`deps`未变化，不执行传入的函数，直接返回上次的`callback() 返回值`
- 否则，执行传入的函数返回一个新`callback() 返回值`

### useImperativeHandle

用于`forwardRef FC`内，自定义指向该`FC`的`ref`的`current`值，如下例：

```ts
export default forwardRef(function Comp(
  props,
  ref,
) {
  useImperativeHandle(ref, () => ({
    a: () => {},
    b: () => {},
  }))
  return <div></div>
})
```

### useTransition

```ts
const [isPending, startTransition] =
  useTransition()
```

`startTransition`不会延迟耗时组件`render`阶段的执行（意味着若耗时组件时间花在`render`阶段，无效）
<!-- render阶段被打断是怎么个过程 -->

打断发生在调度任务开始时，也就是说一个调度任务执行中是无法打断的，也就是这个调度任务的render、commit都无法打断

低优先级任务的会被合并，最终只执行一次commit

但是可以区分调度的优先级，让高优先级的任务优先调度渲染，但是若后续的低优先级任务render、commit执行耗时较大，仍会阻塞UI交互
