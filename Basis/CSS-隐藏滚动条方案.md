# CSS-隐藏滚动条方案

```jsx
// 示例代码
<div className='outer-Container'>
  <div className='inner-Container'></div>
</div>
```

### scrollbar 伪类方案

- 仅支持 webkit 内核浏览器
- 简单

```scss
// 隐藏横向滚动条为例
.inner-container {
  overflow-x: auto;
  ::-webkit-scrollbar {
    display: none;
  }
}
```

### 负边距方案

- 各浏览器均支持
- 与之相比复杂点，父容器需要**固定高度**

```scss
// 隐藏横向滚动条为例
.outer-container {
  height: 32px;
  overflow-x: hidden;
}
.inner-container {
  overflow-x: auto;
  padding-bottom: 50px;
  margin-bottom: -50px;
}
```
