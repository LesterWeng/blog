# Vue3-副作用处理

下面我们以如下基础示例代码为例，分别使用`watch`和`watchEffect`来实现组件在`mounted`后以及`props.data`改变后调用`initPlot`初始化视图的功能

```ts
const props = defineProps<{
  data: {
    time: string
    value: number
  }[]
}>()

const containerRef = ref<HTMLDivElement>(null)
const plot = ref<Plot<LineOptions>>(null)
const initPlot = () => {
  plot.value?.destroy()

  plot.value = new Line(containerRef.value, {
    data: props.data,
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    xAxis: {
      tickCount: 5,
    },
  })

  plot.value.render()
}
```

### watch

如下几种写法，你觉得哪些有问题呢？

```ts
// 1
watch(() => props.data, initPlot, {
  immediate: true,
  flush: 'post',
})

// 2
onMounted(() => {
  initPlot()
})
watch(() => props.data, initPlot)

> 答案：写法2正确；写法1有问题，首次会立即调用而不是在`mounted`后，后续会在`update`后执行（不使用`flush`选项默认在`update`前执行）
```

### watchEffect

下面的写法，没问题吧？

```ts
watchEffect(() => {
  initPlot()
})
```

> 答案：正常直接在`watchEffect`写副作用即可，但这里的话...，会无限重复渲染的~（`plot.value = ...`）
