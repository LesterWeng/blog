# React-lane 解析

> 主要讨论`FC`

### fiber.lanes、fiber.childLanes

表示`当前fiber`或`子fiber`是否有工作需要进行，若为`NoLanes`则会跳过更新以优化

1. `dispatchAction`时会根据`fiber.lanes`来决定是否开始调度
   1. 若为`NoLanes`，则会再根据`(alternate === null || alternate.lanes === NoLanes)` && `is(eagerState, currentState)`来判断是否开始调度，当不满足时才开始调度
   2. 若不为`NoLanes`，则直接开始调度
2. 开始调度(即调用`scheduleUpdateOnFiber`)时会使用`markUpdateLaneFromFiberToRoot`给`fiber`以及`fiber.alternate`标记上`lane`，并且给`fiber.return -> root`标记上`childLanes`以标识是否子 fiber 有需要进行的工作
3. `beginWork` 内未`bailoutOnAlreadyFinishedWork`时和`renderWithHooks`内会重置`wip fiber.lanes`为`NoLanes`

案例

现象：`setNum(1)`第二次调用仍触发`Comp()`执行，再次打印出'render'

原因：第一次调用后 `current fiber` 上的 `lanes` 未重置，第二次调用时原来的 `current fiber` 作为 `wip fiber`，其上的 `lanes === 1`，这才导致了这次 `state 未改变`仍触发了`Comp()`执行

那么我们可以修改`markUpdateLaneFromFiberToRoot`只给`fiber`打上`lanes`吗？

答案是`不可以`，由于`dispatchAction`函数始终`bind`到最初的`current fiber`上，在调用时该`fiber`可能是作为`wip fiber`，也可能作为`current fiber`，若不修改`alternate.lanes`，会导致`alternate`作为`wip fiber`时，错误复用了`current fiber`的值为`0`的`lanes`，导致`React工作流程`中错误判断为不需要进行更新

```ts
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
