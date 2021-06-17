# JavaScript 深入

> 本文部分参考自 [JavaScript 深入系列](https://github.com/mqyqingfeng/Blog)，在此对冴羽大大表示感谢

## 从原型到原型链

```js
function Person() {}
const person = new Person()
```

#### 原型

原型可以理解为 Person 函数刚创建时初始化的一个原始的实例；当 Person 的实例在访问属性或方法时，如果实例本身不包含，则会继续在原型上进行查找，如果找到，则使用原型上的属性/方法

可以通过两种方式访问：

- `prototype`: 显式原型（构造函数的原型）
- `__proto__`(仅浏览器中可访问) / `Object.getPrototypeOf()`: 隐式原型（实例的原型）

有如下关系：
`Person.prototype === person.__proto__ === Object.getPrototypeOf(person)`

#### 原型链

原型链就是原型及原型的原型所组成的链式结构，当 Person 的实例在访问属性或方法时，若原型上也未查找到，则会继续沿着原型链往上查找，如果找到，则使用找到的原型上的属性/方法，从而实现类似面向对象语言中'继承'的效果

如下原型链：
`person.__proto__ => person.__proto__.__proto__ => person.__proto__.__proto__.__proto__`

分别对应：
`Person.prototype => Object.prototype => null`

## 词法作用域和动态作用域

#### 作用域

作用域是指程序源代码中定义变量的区域。

作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

#### 静态作用域(词法作用域)与动态作用域

静态：函数的作用域在函数定义时就确定了

动态：函数的作用域在函数调用时才能确定

```js
var a = 1
function func1() {
  console.log(a)
}

function func2() {
  var a = 2
  func1()
}

func2()
```

如上例子，将打印出 1，这正是由于 js 使用的是词法作用域，若为动态作用域，则将打印出 2

Ps: 非严格模式下，若变量未声明且未赋值，使用会报错；而在严格下，若变量未声明，使用就会报错

## 执行上下文栈

可执行代码包括：

- 全局代码
- 函数代码
- eval 代码

当执行全局代码时，会创建全局执行上下文；当执行到一个函数代码时，会创建函数执行上下文

执行上下文包含三个重要属性：

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

执行上下文栈便是用于管理执行上下文的

```js
function func3() {
  console.log('func3')
}

function func2() {
  func3()
}

function func1() {
  func2()
}

func1()
```

上例执行上下文栈变化情况如下：

```js
// 代码开始执行，遇到全局代码，生成全局上下文并入栈
ECStack = [
    globalContext
];

// func1
ECStack.push(<func1> functionContext);

// func1内调用了func2
ECStack.push(<func2> functionContext);

// func2内调用了func3
ECStack.push(<func3> functionContext);

// func3执行完毕
ECStack.pop();

// func2执行完毕
ECStack.pop();

// func1执行完毕
ECStack.pop();

// 继续执行其他代码，globalContext未出栈
```

#### 变量对象

变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明

- 进入执行上下文阶段，变量对象会包括：

  1. 函数的所有形参 (如果是函数上下文)
     - 由名称和对应值组成的一个变量对象的属性被创建
     - 没有实参，属性值设为 undefined
  2. 函数声明
     - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
     - 如果变量对象已经存在相同名称的属性，则完全替换这个属性
  3. 变量声明
     - 由名称和对应值（undefined）组成一个变量对象的属性被创建
     - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

- 代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值

#### 作用域链

- 函数创建阶段
  - 函数有一个内部属性 [[Scopes]]，当函数创建的时候，会保存所有父变量对象到其中
- 函数激活阶段
  - 当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端

#### this

- 从多种情形确定 this
  - 默认：全局环境中指向 window；函数中，this 绑定到 undefined，在非严格模式下，则绑定到 window
  - 由 new 调用？绑定到新创建的对象
  - 由 call 或者 apply（或者 bind）调用？绑定到指定的对象
  - 由上下文对象调用？绑定到那个上下文对象(注意`数组`也是对象)，若为间接引用时，使用默认规则
  - ES6 箭头函数会根据当前的词法作用域来决定 this, 会继承外层函数调用的 this 绑定
- 特殊情况下的 this 指向： &&、||、=、(,)、双目 等运算符返回‘真正的值’(GetValue)，而不是 Reference，this 绑定到 undefined，在非严格模式下，则绑定到 window，如下：

  ```js
  var value = 1

  var foo = {
    value: 2,
    bar: function () {
      return this.value
    },
  }

  console.log(foo.bar()) // 2 等同于console.log((foo.bar)());
  var func = foo.bar
  console.log(func()) // 1，间接引用
  console.log((true && foo.bar)()) // 1
  console.log((false || foo.bar)()) // 1
  console.log((foo.bar = foo.bar)()) // 1
  console.log((foo.bar, foo.bar)()) // 1
  console.log((foo.bar ? foo.bar : null)()) // 1
  ```

> 当多个规则同时出现时，`new` 的优先级最高，接下来是 `bind` 这些函数，然后是`上下文对象调用`，最后是`间接引用`，同时，`箭头函数`的 this 一旦被绑定，就不会再被任何方式所改变

#### 执行上下文整体举例分析

```js
var scope = 'global scope'
function checkscope() {
  var scope = 'local scope'
  function f() {
    return scope
  }
  return f
}
checkscope()()
```

- 执行全局代码，创建全局执行上下文，入执行上下文栈

```js
ECStack = {
  globalContext,
}
```

- 全局上下文初始化，全局上下文的 VO 是全局变量

```js
globalContext = {
  VO: global,
  scope: [globalContext.VO],
  this: globalContext.VO,
}
```

- 全局上下文初始化过程中，checkscope 函数被创建，保存作用域链到内部属性[[Scopes]]

```js
checkscope[[Scopes]] = globalContext.scope
```

- 执行 checkscope 函数，创建 checkscope 函数执行上下文，入执行上下文栈

```js
ECStack = {
  checkscopeContext,
  globalContext,
}
```

- checkscope 函数执行上下文初始化：
  - 复制[[Scopes]]创建 scope
  - 用 arguments、形参、变量声明、函数声明初始化 VO
  - VO 压入 scope

```js
checkscopeContext = {
    VO: {
        arguments: {
        },
        scope: undefined,
        f: reference to function f
    },
    scope: [checkscopeContext.VO, globalContext.VO],
    this: undefined
}
```

- checkscope 函数执行上下文初始化过程中，f 函数被创建，保存作用域链到内部属性[[Scopes]]

```js
f[[Scopes]] = globalContext.scope
```

- checkscope 函数执行完毕，checkscopeContext 出执行上下文栈

```js
ECStack = {
  globalContext,
}
```

- 执行 f 函数，创建 checkscope 函数执行上下文，入执行上下文栈

```js
ECStack = {
  fContext,
  globalContext,
}
```

- f 函数执行上下文初始化，过程与 checkscope 函数上下文同理

- f 函数执行完毕，fContext 出执行上下文栈

```js
ECStack = {
  globalContext,
}
```

## 闭包

闭包 = 函数 + 函数能够访问的自由变量（自由变量是指在函数中使用的，但既不是该函数的参数也不是该函数的局部变量的变量）

理论角度：js 里所有的函数都会形成闭包，因为这些函数在创建的时候就将上层上下文的数据保存起来了（全局变量同样也可以作为自由变量）

实际角度：内部函数引用了外部变量，当执行内部函数时，就形成了闭包，即使外部函数执行上下文已被销毁，闭包对象依然会存在堆内存内（可查看 chrome devtool debugger `scope`）

外部函数执行上下文销毁情况的闭包举例：

```js
// eg1
function A() {
  let a = 1
  return function () {
    console.log(a)
  }
}
const B = A()
B() // 1

// eg2
function A() {
  const a = 1
  window.B = function () {
    console.log(a)
  }
}
A()
B() // 1
```
