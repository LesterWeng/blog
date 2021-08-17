# TS-条件类型和工具类型

## 条件类型(extends)

### 作用于非泛型时

此时与正常理解的`JS三元表达式`基本表现一致，比较容易理解

如下示例(结果均为`true`)：

```ts
type A = 'x' extends 'x' ? true : false

type B = 'x' extends string ? true : false

type C = 'x' | 'y' extends 'x' ? false : true

type D = string extends string | number
  ? true
  : false

interface E {
  x: 1
}
interface F extends E {
  y: 2
}
type G = F extends E ? true : false
```

下面`工具类型`中的`Exclude`、`Extract`就是使用`extends`实现的

### 作用于泛型时

此时`TS`会返回一个`包含所有结果的联合类型`

如下示例：

```ts
type A<T, U> = T extends U ? false : true

type B = A<'x' | 'y', 'x'> // boolean
```

## 工具类型(Utility Type)实现

```ts
// Partial
type myPartial<T> = {
  [k in keyof T]?: T[k]
}

// Required
type myRequired<T> = {
  [k in keyof T]-?: T[k]
}

// Readonly
type myReadonly<T> = {
  readonly [k in keyof T]: T[k]
}

// Record
type myRecord<
  K extends string | number | symbol,
  T,
> = {
  [k in K]: T
}

// Pick
type myPick<T, K extends keyof T> = {
  [k in myExtract<keyof T, K>]: T[k]
}

// Omit
type myOmit<T, K extends keyof T> = {
  [k in myExclude<keyof T, K>]: T[k]
}

// Exclude
type myExclude<T, U> = T extends U ? never : T

// Extract
type myExtract<T, U> = T extends U ? T : never

// NonNullable
// PS:TS中的null类型包括js中的null和undefined
type myNonNullable<T> = myExclude<T, null>

// Parameters
// PS:infer结合extends可进行子类型推断,P指代被推断的子类型
type myParamters<T> = T extends (
  ...args: infer P
) => any
  ? P
  : unknown

// ConstructorParameters

// ReturnType
type myReturnType<T> = T extends (
  ...args: any
) => infer R
  ? R
  : any

// InstanceType

// ThisParameterType
```
