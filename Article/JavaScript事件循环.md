# JavaScript 事件循环

### 事件循环

JS 分为同步任务、异步任务；同步任务都在主线程上执行，形成一个执行栈；异步任务分为宏任务、微任务

事件循环就是指主线程不断循环地从任务队列中读取任务，执行任务的过程

### 宏任务(macrotask)

宏任务包括：script(整体代码，包含所有同步任务、其他宏任务和微任务)、setTimeout、setInterval、UI 交互（如点击等事件）、 I/O、postMessage、 MessageChannel、setImmediate(非标准，仅 IE10+、Edge 实现，其他浏览器未实现；Node.js 环境)

### 微任务(microtask)

微任务包括：Promise.then、 MutaionObserver、process.nextTick(Node.js 环境）

### 运行机制

在事件循环中，每进行一次循环操作称为 tick，每一次 tick 的任务处理模型是比较复杂的，执行过程如下描述：

首先执行宏任务队列中的一个宏任务（初始为 script 整体代码），执行中遇到宏任务或微任务将其加入对应队列，宏任务执行完后，执行完微任务队列中所有的微任务（包括这次宏任务新加入的微任务和执行微任务时新加入的微任务，总之会执行完这次 tick 加入到微任务队列的所有微任务），之后进行 UI 渲染，这次 tick 结束，下一次 tick 开始，重复上述步骤...

### 实例分析

掌握事件循环执行机制后，可能有个问题还无法解决：await 语句的执行顺序

由于 async/await 实际是 promise 的语法糖，`await xxx;yyyy` 语句可以理解为 `Promise.resolve(xxx).then(() => yyyy)`，具体可查阅 babel 转义后的源码及 [Promise.resolve()](http://es6.ruanyifeng.com/#docs/promise#Promise-resolve)的用法

```js
// 1
async function a1() {
  console.log('a1 start');
  await a2();
  console.log('a1 end');
}
async function a2() {
  await Promise.resolve().then(() => {
    console.log('special');
  });
  console.log('a2');
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('promise1');
});

a1();

let promise2 = new Promise((resolve) => {
  resolve('promise2.then');
  console.log('promise2');
});

promise2.then((res) => {
  console.log(res);
  Promise.resolve().then(() => {
    console.log('promise3');
  });
});
console.log('script end');

/* 结果为：
script start
a1 start
promise2
script end
promise1
special
promise2.then
a2
promise3
a1 end
setTimeout
*/

// 2
async function async1() {
  console.log('async1 start');
  await async2();
  setTimeout(function () {
    console.log('setTimeout1');
  }, 0);
}
async function async2() {
  setTimeout(function () {
    console.log('setTimeout2');
  }, 0);
}
console.log('script start');

setTimeout(function () {
  console.log('setTimeout3');
}, 0);
async1();

new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end');

/* 结果为：
script start
async1 start
promise1
script end
promise2
setTimeout3
setTimeout2
setTimeout1
*/
```

### 参考文章

[从一道题浅说 Javascript 的事件循环](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7)
