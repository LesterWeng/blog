# 手写 call、apply、bind

```js
const fnCall = (fn, context, ...args) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Error')
  }

  context = context || window
  context._fn = fn
  const result = context._fn(...args)
  Reflect.deleteProperty(context, '_fn')
  return result
}

const fnApply = (fn, context, args) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Error')
  }

  context = context || window
  context._fn = fn
  const result = context._fn(...args)
  Reflect.deleteProperty(context, '_fn')
  return result
}

const fnBind = (fn, context, ...args) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Error')
  }

  context = context || window
  context._fn = fn
  return (...otherArgs) => {
    context._fn(...args, ...otherArgs)
    Reflect.deleteProperty(context, '_fn')
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
