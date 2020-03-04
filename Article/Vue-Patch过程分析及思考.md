# Vue-Patch 过程分析及思考

## Patch 过程分析

### Patch

### patchVnode

### updateChildren

1. 空节点跳过处理

2. 指针 1 对应的 vnode 跟指针 3 对应的 node 比，如果是 same 的就 patchVnode 进行更新，如果不是 same 的就往下走

3. 指针 2 对应的 vnode 跟指针 4 对应的 node 比，如果是 same 的就 patchVnode 进行更新，如果不是 same 的就往下走

4. 指针 1 对应的 vnode 跟指针 4 对应的 node 比，如果是 same 的就 patchVnode 进行更新，如果不是 same 的就往下走

5. 指针 2 对应的 vnode 跟指针 3 对应的 node 比，如果是 same 的就 patchVnode 进行更新，如果不是 same 的就往下走

6. 最终，如果到了这一步还不是 same 的，那就用 key 最终确认一次

   1. 先构造一个 key to index 的 map
   2. 判断当前 old vnode 的 key 是否在 map 里
   3. 如果不在，就直接 createElm
   4. 如果在，并且是 same 的，那就 patchVnode，然后更新节点内容、顺序
   5. 如果在，但是不是 same 的，那就视作新 element，执行 createElm

7. 当 while 循环退出时，如果指针 1 和指针 2 还没重合，那就代表此时指针 1 和指针 2 区域内的 vnode 是待删除的，所以直接 removeVnodes。而如果是指针 3 和指针 4 还没重合，那就代表指针 3 和指针 4 之间的 vnode 是待添加的，所以直接 addVnodes。至此整个过程结束

## 思考

### 原生 dom 和 virtual dom 更新单个元素内容的性能对比

### 列表渲染性能优化
