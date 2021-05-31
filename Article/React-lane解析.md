# React-lane 解析

> 主要讨论`FC`

### fiber.lanes

表示当前 `fiber` 是否有工作需要进行，若为`NoLanes`则会跳过更新以优化

1. `dispatchAction`时会根据`fiber.lanes`来决定是否开始调度
   1. 若为`NoLanes`，则会再根据`alternate === null || alternate.lanes === NoLanes` && `is(eagerState, currentState)`来判断是否开始调度，当不满足时才开始调度
   2. 若不为`NoLanes`，则直接开始调度
2. 开始调度(即调用`scheduleUpdateOnFiber`)时会使用`markUpdateLaneFromFiberToRoot`给`fiber -> root`标记上`lane`
3. `beginWork` 内未`bailoutOnAlreadyFinishedWork`时和`renderWithHooks`内会重置`wip fiber.lanes`为`NoLanes`

案例：

```ts
// `setNum(1)`第二次调用仍触发`renderWithHooks`执行，再次打印出'render'
// 结合React双缓存工作过程和fiber.lanes即可分析出原因
function Comp() {
  console.log('render')
  const [num, setNum] = useState(0)
  return (
    <button onClick={() => setNum(1)}>
      按钮：{num}
    </button>
  )
}
```

### update.lane

待续...
