# 手写 Promise

### 实现符合 Promise/A+规范的 Promise

> [Promise/A+](https://promisesaplus.com/)

```ts
/**
 * 重点：
 * 每个promise只有在pending状态可以发生状态迁移
 * then会返回一个新promise
 * then的两个回调参数都是可选的，如果没回调参数需要可以'透传'
 */

enum STATE {
  PENDING = 'pending',
  RESOLVED = 'resolved', // FULFILLED
  REJECTED = 'rejected',
}

// 根据父promise的value和子promise来决定处理流程
const resolvePromise = (
  promise: MyPromise,
  value: any,
  resolve: Function,
  reject: Function,
) => {
  if (promise === value) {
    reject(
      new TypeError(
        'Chaining cycle detected for promise!',
      ),
    )
    return
  }

  if (value instanceof MyPromise) {
    value.then(resolve, reject)
    return
  } else if (
    value instanceof Object ||
    value instanceof Function
  ) {
    try {
      const then = value.then

      let isCalled = false

      if (then instanceof Function) {
        try {
          then.call(
            value,
            (v) => {
              if (isCalled) return

              isCalled = true
              resolvePromise(
                promise,
                v,
                resolve,
                reject,
              )
            },
            (v) => {
              if (isCalled) return

              isCalled = true
              reject(v)
            },
          )
        } catch (e) {
          if (!isCalled) {
            reject(e)
          }
        }
      } else {
        resolve(value)
      }
    } catch (e) {
      reject(e)
    }
  } else {
    resolve(value)
  }
}

class MyPromise {
  state: STATE
  value: any
  resolveCbs: Function[]
  rejectCbs: Function[]

  constructor(
    executor: (
      resolve: Function,
      reject: Function,
    ) => any,
  ) {
    this.state = STATE.PENDING
    this.value = null

    // pending状态时可能会绑定多个cb，类似promise.then(() => {});promise.then(() => {})写法，
    // 故而一个promise实例可能有多个cb
    this.resolveCbs = []
    this.rejectCbs = []

    const resolve = (value) => {
      if (value instanceof MyPromise) {
        return value.then(resolve, reject)
      }
      setTimeout(() => {
        if (this.state === STATE.PENDING) {
          this.state = STATE.RESOLVED
          this.value = value
          if (this.resolveCbs.length) {
            this.resolveCbs.forEach((resolveCb) =>
              resolveCb(value),
            )
          }
        }
      })
    }
    const reject = (value) => {
      setTimeout(() => {
        if (this.state === STATE.PENDING) {
          this.state = STATE.REJECTED
          this.value = value
          if (this.rejectCbs.length) {
            this.rejectCbs.forEach((rejectCb) =>
              rejectCb(value),
            )
          }
        }
      })
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(resolveCb?: any, rejectCb?: Function) {
    // 没回调参数时需要可以'透传'
    resolveCb =
      resolveCb instanceof Function
        ? resolveCb
        : (v) => v
    rejectCb =
      rejectCb instanceof Function
        ? rejectCb
        : (e) => {
            // 这里和 return new Promise((resolve, reject) => reject()) 相同
            throw e
          }

    // 这里的state、resolveCbs、rejectCbs是父promise的
    let newPromise
    if (this.state === STATE.PENDING) {
      return (newPromise = new MyPromise(
        (resolve, reject) => {
          this.resolveCbs.push((v) => {
            // 这里没有异步执行，因为调用时已经是异步的了
            try {
              const value = resolveCb(v)
              resolvePromise(
                newPromise,
                value,
                resolve,
                reject,
              )
            } catch (e) {
              rejectCb(e)
            }
          })
          this.rejectCbs.push((v) => {
            try {
              const value = rejectCb(v)
              resolvePromise(
                newPromise,
                value,
                resolve,
                reject,
              )
            } catch (e) {
              rejectCb(e)
            }
          })
        },
      ))
    } else if (this.state === STATE.RESOLVED) {
      return (newPromise = new MyPromise(
        (resolve, reject) => {
          // 异步执行，避免其后的同步代码被阻塞
          setTimeout(() => {
            try {
              const value = resolveCb(this.value)
              resolvePromise(
                newPromise,
                value,
                resolve,
                reject,
              )
            } catch (e) {
              rejectCb(e)
            }
          })
        },
      ))
    } else {
      return (newPromise = new MyPromise(
        (resolve, reject) => {
          // 异步执行，避免其后的同步代码被阻塞
          setTimeout(() => {
            try {
              const value = rejectCb(this.value)
              resolvePromise(
                newPromise,
                value,
                resolve,
                reject,
              )
            } catch (e) {
              rejectCb(e)
            }
          })
        },
      ))
    }
  }
}
```

### 使用 Promise 实现工作流

实现 `createFlow`，使得如下代码按照 a,b,延迟 1 秒,c,延迟 1 秒,d,e, done 的顺序打印

```ts
const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms),
  )

const subFlow = createFlow([
  () => delay(1000).then(() => log('c')),
])

createFlow([
  () => log('a'),
  () => log('b'),
  subFlow,
  [
    () => delay(1000).then(() => log('d')),
    () => log('e'),
  ],
]).run(() => {
  console.log('done')
})
```

实现：

```ts
const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms),
  )
const log = console.log

type Work = (() => any) | Flow
type Flow = {
  run: (cb?: () => any) => Promise<any>
}
type Unit = Work | Unit[]

const createFlow: (works: Unit[]) => Flow = (
  works,
) => {
  const loop = (workItems: Unit[]) => {
    return workItems.reduce((prev, curr) => {
      if (curr instanceof Array) {
        return prev.then(() => loop(curr))
      } else {
        return prev.then(() =>
          curr instanceof Function
            ? curr()
            : curr.run(),
        )
      }
    }, Promise.resolve())
  }

  return {
    run: (cb) =>
      cb instanceof Function
        ? loop(works).then(cb)
        : loop(works),
  }
}
const subFlow = createFlow([
  () => delay(1000).then(() => log('c')),
])
createFlow([
  () => log('a'),
  () => log('b'),
  subFlow,
  [
    () => delay(1000).then(() => log('d')),
    () => log('e'),
  ],
]).run(() => {
  console.log('done')
})
```
