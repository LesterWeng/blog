# React-性能优化

> 这里只谈`FunctionComponent`相关
> 下文涉及：`render`指`FunctionComponent`函数，`render阶段`指 React render 阶段（即调和器`reconciler`工作阶段），`commit阶段`指 React commit 阶段（即渲染器`renderer`工作阶段），详见[React-流程概览](./React-流程概览.md)
> React 性能优化就是在`render阶段`或`commit阶段`进行优化，`commit阶段`主要包括`DOM操作`及其相关的`Effect`处理(如`useEffect/useLayoutEffect/componentDidMount`等)，由 React 内部管理，开发者难以插手，下文均为`render阶段`的优化手段

### React.Memo

- 浅比较(即`shallowEqual`，`shallowEqual({x: 1}, {x: 1}) = true`)`props`，避免无效`render`

> `ClassComponent`的`PureComponent`浅比较`state`和`props`

### useMemo、useCallback

- 缓存计算结果，减少`render`耗时
- 缓存`jsx`
- 生成稳定值
  - 作为`dependencies`时提供稳定的依赖
  - 作为`props`避免子组件无效`render`

### 发布订阅 + 高阶组件

可以理解为将`不关心状态的组件`提升到`有状态组件的外部`，避免`不关心状态的组件`无效`render`

如下例，当后面`setState`时，只有使用到`CustomContext`的`ChildComponent1`重新`render`了。原因是`CtxContainer`内部的`setState`不会导致外部`ParentComponent`的更新，不会再使用`React.createElement`生成 2 个子组件的新`ReactElement`(生成的`ReactElement`的`props`每次都会是一个新对象，如果重新生成`ReactElement`则必然会导致`CtxContainer`的`ReactElement`的`props`的改变)

```ts
const CustomContext = React.createContext(null)

function ChildComponent1() {
  const contextValue = React.useContext(
    CustomContext,
  )
  console.log('1 render')
  return <div>{contextValue}</div>
}
function ChildComponent2() {
  console.log('2 render')
  return <div>comp2</div>
}

function CtxContainer({ children }) {
  const [
    contextState,
    setContextState,
  ] = React.useState(null)

  React.useEffect(() => {
    setTimeout(() => {
      setContextState('change')
    }, 5000)
  }, [])

  return (
    <CustomContext.Provider value={contextState}>
      {children}
    </CustomContext.Provider>
  )
}

export default function ParentComponent() {
  return (
    <CtxContainer>
      <ChildComponent1 />
      <ChildComponent2 />
    </CtxContainer>
  )
}
```

### 批量更新

`React`内的`事件回调、hook回调、钩子函数`(内部可能包含`setState`)在执行时，当前`executionContext`会打上`BatchedContext`的`flag`，表示使用批量更新进行优化。但这些`fn`内部可能由于各种原因（`宏任务、微任务`）跳出当前事件循环的`同步Script`，而后当这些`fn`执行时，当前`executionContext`已恢复之前的状态，丢失了`BatchedContext`的`flag`，便无法进行批量更新优化，导致进行了多次`render`，但这种情况是可以优化的，方法及源码如下：

- 将多个`state`进行合并

- 使用`ReactDOM.unstable_batchedUpdates`(其实就是`batchedUpdates`方法)合并`setState`

```ts
export function batchedUpdates<A, R>(fn: A => R, a: A): R {
  const prevExecutionContext = executionContext;
  executionContext |= BatchedContext;
  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      resetRenderTimer();
      flushSyncCallbackQueue();
    }
  }
}
```

### 列表项使用 key

在`commit阶段`列表项`diff`时，若不存在`key`值，则默认使用`index`作为键进行比较，否则使用`key`值，使用`key`值可以减少`DOM操作`次数，优化性能。

虽然推荐使用`key`值，但使用之后并不一定能减少`DOM操作`，比如下面的`简单列表`：

```ts
// 不使用key，状态更新前后
<ul>
  <li>1</li>
  <li>2</li>
</ul>
<ul>
  <li>3</li>
  <li>4</li>
</ul>

// 使用key，状态更新前后
<ul>
  <li key='1'>1</li>
  <li key='2'>2</li>
</ul>
<ul>
  <li key='3'>3</li>
  <li key='4'>4</li>
</ul>

```

结果解析：不使用`key`时，使用默认`index`作为键比较，`React`认为 2 个子`fiberNode`可复用，因而只需要进行 2 次`DOM更新`操作；
而使用`key`时，由于`key`变了，`React`认为 2 个子`fiberNode`不可复用，则需要进行 2 次`DOM删除`和 2 次`DOM插入`操作
