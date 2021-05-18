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
const run = (genFn) => {
  return () =>
    new Promise((resolve, reject) => {
      const gen = genFn()

      const next = (fn) => {
        let result

        try {
          result = fn()
        } catch (err) {
          reject(err)
        }

        if (result.done) {
          return resolve(result.value)
        } else {
          Promise.resolve(result.value)
            .then((data) =>
              next(() => gen.next(data)),
            )
            .catch((err) =>
              next(() => gen.throw(err)),
            )
        }
      }

      next(() => gen.next(undefined))
    })
}
```
