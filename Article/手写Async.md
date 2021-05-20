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
// 错误处理：捕获yield语句执行过程中的错误、yield返回reject promise的错误、需要支持函数内的try catch
// run返回的是一个函数(不是promise...)

const run = (genFn) => {
  const gen = genFn()
  return () =>
    new Promise((resolve, reject) => {
      const next = (fn) => {
        let res
        // catch yield执行过程中的错误
        try {
          res = fn()
        } catch (err) {
          reject(err)
        }

        if (res.done) {
          resolve(res.value)
        } else {
          // catch yield返回reject promise时的错误，这里错误需要通过throw抛出使得generator内部可以使用try catch捕获到
          Promise.resolve(res.value)
            .then((data) => {
              next(() => gen.next(data))
            })
            .catch((err) => {
              next(() => gen.throw(err))
            })
        }
      }
      next(undefined)
    })
}
```
