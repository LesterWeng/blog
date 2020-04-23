### 手写 Promise

```js
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

/**
 * 状态不可逆,pending -> resolved/rejected
 * 链式调用
 */
class MyPromise {
  constructor(cb) {
    this.state = PENDING;
    this.value = null;
    this.resolveCbs = [];
    this.rejectCbs = [];

    const resolve = (value) => {
      // promise内resolve
      if (this.state === PENDING) {
        this.state = RESOLVED;
        this.value = value;
        this.resolveCbs.length && resolve();
      }
      // then内return
      else if (this.state === RESOLVED) {
        try {
          this.value = this.resolveCbs.shift()(this.value);
          this.resolveCbs.length && resolve();
        } catch (err) {
          reject(err);
        }
      }
    };
    const reject = (value) => {
      // promise内reject和then内出错
      if (this.state === PENDING || this.state === RESOLVED) {
        this.state = REJECTED;
        if (this.rejectCbs.length) {
          this.value = this.rejectCbs.shift()(value);
        }
      }
    };

    // 初始化resolveCbs和rejectCbs
    setTimeout(() => {
      cb(resolve, reject);
    });
  }

  // link invoke
  then(resolveCb, rejectCb) {
    if (this.state === PENDING) {
      resolveCb && this.resolveCbs.push(resolveCb);
      rejectCb && this.rejectCbs.push(rejectCb);
    } else if (this.state === RESOLVED) {
      resolveCb && resolveCb();
    } else {
      rejectCb && rejectCb();
    }
    return this;
  }
  catch(cb) {
    if (this.state === PENDING) {
      this.rejectCbs.push(cb);
    } else if (this.state === REJECTED) {
      cb();
    }
    return this;
  }

  // wrapper
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    } else {
      return new MyPromise((resolve, reject) => {
        resolve(value);
      });
    }
  }
  static reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    });
  }
}

// test
new MyPromise((resolve, reject) => {
  resolve(5);
})
  .then((res) => {
    console.log(res);
    return 6;
  })
  .then(console.log)
  .then(() => {
    throw new Error('error');
  })
  .catch(console.log);
```
