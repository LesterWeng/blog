# new 和 instanceof

### new

原理：

1. 新建对象
2. 绑定原型链
3. 绑定 this 并执行 Constructor
4. 返回对象

实现：

```js
function fnNew() {
  const obj = {}
  const Constructor = [].shift.apply(arguments)
  Reflect.setPrototypeOf(
    obj,
    Constructor.prototype,
  )
  const result = Constructor.apply(obj, arguments)
  return result instanceof Object ? result : obj
}

// 使用
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.say = function () {
  console.log(
    `hello, my name is ${this.name}, I'm ${this.age}`,
  )
}
const xiaoMing = fnNew(Person, 'xiaoming', 18)
xiaoMing.say()
```

> 注意：`shift`方法用于类数组对象后，类数组对象也会移除第一项并改变`length`（如果类数组对象为`{length: 5}`，则执行后将变成`{length: 4}`），`pop`同理

### instanceof

原理：沿着左侧对象的原型链，查找右侧类的原型，如果找到则返回`true`，反之返回`false`

实现：

```js
function fnInstanceOf(left, right) {
  try {
    // left非object时报错
    let proto = Reflect.getPrototypeOf(left)
    while (proto) {
      if (proto === right.prototype) {
        return true
      }
      proto = Reflect.getPrototypeOf(proto)
    }
  } catch (e) {
    return false
  }
  return false
}
```
