# TS-联合类型和 Narrowing

`A | B`可以理解 为`A、B的并集`类型，不可直接使用`非A、B的交集`的部分，但可使用`Narrowing(窄化)`帮助 `TS` 正确判断

可使用很多种方式进行`Narrowing`：

- `typeof`
- `instanceof`
- `in`
- `===、!==、==、!=`：如`if(a !== null)`
- `=`：如`a = 1`，则推断为`number`
- `as`：即`类型断言`，告诉`TS`该值的类型
- `!`：表示排除值为`null/undefined`的情况，如`instance.fn!()`

如下例：

```ts
// 例1
type A = {
  name: string
  age: number
}
type B = {
  name: string
  gender: boolean
}

// 错误写法
// error: Property 'age' does not exist on type 'B'
function fn(instance: A | B) {
  return instance.age
}
fn({ name: '1', age: 1 })

// 正确写法
function fn(instance: A | B) {
  if ('age' in instance) {
    return instance.age
  } else {
    return instance.gender
  }
}
fn({ name: '1', age: 1 })

// 例2
type A = {
  name: string
}
type B = () => {}

// 错误写法
// error: Type 'A' has no call signatures
function fn(instance: A | B) {
  return instance()
}
fn({ name: '1' })

// 正确写法
function fn(instance: A | B) {
  if (instance instanceof Function) {
    return instance()
  } else {
    return instance.name
  }
}
fn({ name: '1' })
```
