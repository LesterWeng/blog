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
```

下面`工具类型`中的`Exclude`、`Extract`就是使用`extends`实现的

### 作用于泛型时

此时`TS`会返回一个`包含所有结果的联合类型`

如下示例：

```ts
// interface
interface A {
  x: 1
}
interface B extends A {
  y: 2
}

// type
type aa = B extends A ? true : false

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

// Record

// Pick
type myPick<T, U> = {
  [k in myExtract<keyof T, U>]: T[k]
}

// Omit
type myOmit<T, U> = {
  [k in myExclude<keyof T, U>]: T[k]
}

// Exclude
type myExclude<T, U> = T extends U ? never : T

// Extract
type myExtract<T, U> = T extends U ? T : never

// NonNullable

// Parameters

// ConstructorParameters

// ReturnType

// InstanceType

// ThisParameterType
```
