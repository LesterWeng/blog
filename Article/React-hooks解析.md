# React-hooks 解析

`dispatchAction` bind 的`fiber`是固定的，即始终`bind`到`current`、`wip`中的一棵树上，在调用时该`fiber`可能是作为`wip fiber`，也可能作为`current fiber`，而`current fiber`和`wip fiber`，其上的部分属性并不一致，如`lanes`不一致

### useState

### useEffect

`mount`阶段调用时，给当前`wip fiber`打上`PassiveEffect | PassiveStaticEffect`flag

`update`阶段调用时，给当前`wip fiber`打上`PassiveEffect`flag

### useLayoutEffect

`mount`、`update`阶段调用时，给当前`wip fiber`打上`Update`flag

与`useEffect`基本一致，区别在于`useLayoutEffect`的回调会在

### useRef

### useCallback

### useMemo
