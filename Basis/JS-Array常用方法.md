# JS-Array 常用方法

1. Array.prototype.sort([compareFunction])

   - 默认根据字符串 Unicode 码排序
   - compareFunction 返回值 <0 时升序，而 >0 时降序，注意是根据**正值/负值**判断，而不是**true/false**
   - compareFunction 返回值 =0 时，相对位置不变（不能保证），当存在相等的字符串时，排序的结果将不再**幂等**，即多次相同规则的排序结果可能不一致，为了维持幂等，我们可以添加额外的条件，举例如下：

   ```js
   // updateTime精确到秒，可能重复；id唯一
   const arr = [{
       id: 1,
       updateTime: '2019/07/12 15:06:09'
   },
   ...
   ];
   arr.sort((a, b) => {
       if(a.updateTime === b.updateTime){
           return a.id - b.id;
       }else{
           return a.updateTime > b.updateTime ? 1 : -1;
       }
   })
   ```

2. Array.prototype.reduce(callback, [initialValue])

   - 没有 initialValue 时，将使用数组第一个项作为初始值，[].reduce(() => {})就会由于缺失初始值而报错
   - callback 的返回值要与数组中项的结构类似，否则结果会异常，举例如下：
   - Array.prototype.reduceRight 为从右向左遍历，没有 initialValue 时，将使用数组最后一项作为初始值

   ```js
   [{ x: 1 }, { x: 2 }, { x: 3 }].reduce((a, b) => a.x + b.x); // 结果为NaN，第一次计算的结果为3，作为下一次计算的'a'，a.x -> NaN
   ```

3. Array.prototype.flat([depth])

   - 按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回，即对数组每一项进行**数组层面的降级**
   - depth 默认为 1
   - Array.prototype.flatMap 对 Array.prototype.map 返回的每一项进行**数组层面的降级**

4. Array.prototype.push(element1, ..., elementN)

   - 依次将这些元素添加到数组末尾，**入栈**操作，返回值是新数组的**length**
   - Array.prototype.pop()，**出栈**操作
   - Array.prototype.unshift(element1, ..., elementN)，依次将这些元素添加到数组开头，**入队列**操作，返回值是新数组的**length**
   - Array.prototype.shift()，**出队列**操作

5. Array.prototype.entries()

   - 返回一个迭代器 iterator
   - 使用 for...of 遍历时，左边参数为[index, value]，实际每次遍历时调用 iterator.next()
   - forEach、for 循环、map、some、every、filter、find 等等遍历按情形进行选择，如需要 **break/continue** 选择 for 循环，用于 Bool 型判断选择 some、every、!!find，用于返回其他的结构数据选择 map...

6. Array.prototype.fill()

   - 使用参数填充数组，若参数为对象，则数组中每个元素均指向此对象

7. Array.from()

   - 从一个**类数组对象**或**可迭代对象**创建一个新的、浅拷贝的数组
   - 类数组对象
     - 拥有 length 属性，其他属性（索引，非数字不考虑）为非负整数的非数组对象
     - 简单判断: `0<=length<+∞` 的对象
   - 类数组对象不一定可迭代，但可迭代一定是数组 or 类数组对象

8. Array.isArray()

   - 判断传入数据是否为数组，等于 instanceof

9. new Array()/Array()/[]

   - new Array()/Array()完全一致
     - 支持形如 new Array(5)，创建指定长度且数据均为**empty**的数组，无法使用**for 循环**以外的遍历方法进行遍历
     - 支持形如 new Array(1, 2)，创建具有指定元素的数组
   - []
     - 支持形如 [1],[1,2]，创建具有指定元素的数组，仅在单个参数时与上面两种结果不同
