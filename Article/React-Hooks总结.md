# React-Hooks 总结

### useState

- 对应于`this.setState`
- 和`this.setState`的区别在于它每次 `render` 后不会生成新的`state`，而是更新部分值，引用本身不变

### useEffect

`useEffect(func, arr)`

- 对应于`componentDidMount`、`componentDidUpdate`和`componentWillUnmount`的结合
- 一般用于进行数据请求、监听器、事件绑定等有副作用的操作
- 函数的第二个参数会在`componentWillUnmount`时期执行，可进行清除副作用的操作
- 第二个参数指定依赖的状态数组，仅当这些依赖有发生变化时，函数才会执行，数组为空时表示函数仅执行一次

## useContext

- 对应`Context`
- 和`Context`相同，`value`改变时所有使用此`Context`的组件都会执行`render`

### useReducer

- 组件级的`redux`

### useRef

### useMemo

### useCallback
