# 手写 call、apply、bind

```js
const symbolKey = Symbol('')
const fnCall = (fn, context, ...args) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Error')
  }

  context = context || window
  context[symbolKey] = fn
  const result = context[symbolKey](...args)
  Reflect.deleteProperty(context, symbolKey)
  return result
}

const fnApply = (fn, context, args) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Error')
  }

  context = context || window
  context[symbolKey] = fn
  const result = context[symbolKey](...args)
  Reflect.deleteProperty(context, symbolKey)
  return result
}

const fnBind = (fn, context, ...args) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Error')
  }

  context = context || window
  context[symbolKey] = fn
  return (...otherArgs) => {
    context[symbolKey](...args, ...otherArgs)
    Reflect.deleteProperty(context, symbolKey)
  }
}

// test
const testFn = fnBind(
  function () {
    console.log(this, arguments)
  },
  { bb: 1 },
  2,
  3,
)
testFn(4, 5, 6)
```
