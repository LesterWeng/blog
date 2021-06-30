# 手写 Async

实际是实现自执行的 `Generator`，即如下例中的`run`函数

```js
const getData = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve('data'), 2000),
  )

const test = run(function* () {
  const data = yield getData()
  console.log('data: ', data)
  const data2 = yield getData()
  console.log('data2: ', data2)
  return 'success'
})

test().then((res) => console.log(res))
```

实现：

```js
// 注意：
// 内置执行器
// 返回promise
// await后(yield 返回值)支持promise和原始类型的值
// generator函数内return的值会作为最后done=true时的value
// 错误处理：需要支持函数内的try catch；需要捕获yield语句执行过程中的错误、yield返回reject promise的错误
// run返回的是一个函数(不是promise...)

const run = (genFn) => {
  const gen = genFn()

  return () =>
    new Promise((resolve, reject) => {
      const next = (fn) => {
        let res = null
        try {
          res = fn()
        } catch (e) {
          reject(e)
        }

        if (res.done) {
          resolve(res.value)
        } else {
          Promise.resolve(res.value)
            .then((value) =>
              next(() => gen.next(value)),
            )
            .catch((e) =>
              next(() => gen.throw(e)),
            )
        }
      }

      next(() => gen.next())
    })
}
```
