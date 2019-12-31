# JavaScript 事件循环

### 任务队列

- JS 分为同步任务和异步任务
- 同步任务都在主线程上执行，形成一个执行栈
- 主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放置一个事件。
- 一旦执行栈中的所有同步任务执行完毕（此时 JS 引擎空闲），系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行。

### 宏任务(macrotask)

(macro)task（又称之为宏任务），可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）。

浏览器为了能够使得 JS 内部(macro)task 与 DOM 任务能够有序的执行，会在一个(macro)task 执行结束后，在下一个(macro)task 执行开始前，对页面进行重新渲染

包括：script(整体代码，包含所有同步任务、其他宏任务和微任务)、setTimeout、setInterval、UI 交互（如点击等事件）、 I/O、postMessage、 MessageChannel、setImmediate(非标准，仅 IE10+、Edge 实现，其他浏览器未实现；Node.js 环境)

### 微任务(microtask)

microtask（又称为微任务），可以理解是在当前 task 执行结束后立即执行的任务。也就是说，在当前 task 任务后，下一个 task 之前，在渲染之前。

所以它的响应速度相比 setTimeout 会更快，因为无需等渲染。也就是说，在某一个 macrotask 执行完后，就会将在它执行期间产生的所有 microtask 都执行完毕（在渲染前）。

包括：Promise.then、 MutaionObserver、process.nextTick(Node.js 环境）

### 运行机制

在事件循环中，每进行一次循环操作称为 tick，每一次 tick 的任务处理模型是比较复杂的，但关键步骤如下：

- 执行一个宏任务（栈中没有就从事件队列中获取）
- 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
- 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
- 当前宏任务执行完毕，开始检查渲染，然后 GUI 线程接管渲染
- 渲染完毕后，JS 线程继续接管，开始下一个宏任务（从事件队列中获取）

个人描述：
首先执行宏任务队列中的一个宏任务（初始为 script 整体代码），执行中遇到宏任务或微任务将其加入对应队列，宏任务执行完后，执行完微任务队列中所有的微任务（包括这次宏任务新加入的微任务和执行微任务时新加入的微任务，总之会执行完这次 tick 加入到微任务队列的所有微任务），该宏任务执行完毕后，进行 UI 渲染，这次 tick 结束，下一次 tick 开始，重复上述步骤...

### 实例分析

掌握事件循环执行机制后，可能有个问题还无法解决：await 语句的执行顺序

由于 async/await 实际是 promise 的语法糖，`await xxx;yyyy` 语句可以理解为 `Promise.resolve(xxx).then(() => yyyy)`，具体可查阅 babel 转义后的源码及 Promise.resolve()的用法

```js
// 1
async function a1() {
  console.log('a1 start');
  await a2();
  console.log('a1 end');
}
async function a2() {
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

let promise2 = new Promise(resolve => {
  resolve('promise2.then');
  console.log('promise2');
});

promise2.then(res => {
  console.log(res);
  Promise.resolve().then(() => {
    console.log('promise3');
  });
});
console.log('script end');

/* 结果为：
script start
a1 start
a2
promise2
script end
promise1
a1 end
promise2.then
promise3
setTimeout
*/

// 2
async function async1() {
  console.log('async1 start');
  await async2();
  //更改如下：
  setTimeout(function() {
    console.log('setTimeout1');
  }, 0);
}
async function async2() {
  //更改如下：
  setTimeout(function() {
    console.log('setTimeout2');
  }, 0);
}
console.log('script start');

setTimeout(function() {
  console.log('setTimeout3');
}, 0);
async1();

new Promise(function(resolve) {
  console.log('promise1');
  resolve();
}).then(function() {
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
