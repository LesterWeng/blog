# Sass 常用语法

### 样式嵌套

```
label {
    a {
    }
}
```

### 父选择器 &

指向父选择器，若没有父选择器则为 null，可配合@if 指令使用

```
button {
    &:hover {
    }
}

.foo.bar .baz.bang, .bip.qux {
  $selector: &;
}
```

### 属性嵌套

```
.funky {
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
}
```

### 变量 \$

变量定义时可在结尾添加 `!default` 以修饰，如果变量已经被赋值，则不会再被重新赋值

```
$default-font-size: 32px;
```

### 函数

```
@function px2rem ($px) {
  @return $px / $default-font-size * 1rem;
}
```

### 插值语句 #{}

```
div {
    width: calc(100% - #{px2rem(50px)})
}
```

### @import

```
@import "foo.scss";
@import "foo";
@import "boo.css";
```

### @extend

```
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```

### @if

```
@mixin does-parent-exist {
  @if & {
    &:hover {
      color: red;
    }
  } @else {
    a {
      color: red;
    }
  }
}
```

### @for

包含两种格式
`@for $var from <start> through <end>`
`@for $var from <start> to <end>`

区别在于 to 只包含 `<start>` 的值而不包含 `<end>` 的值
`$var` 可以是任何变量，比如 `$i`

`<start>` 和 `<end>`必须是整数值

```
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
@for $i from 1 to 3 {
  .item-#{$i} { width: 2em * $i; }
}
```

### @each

`$var in <list>`
`$var` 可以是任何变量名，比如 `$length`,`<list>` 是一连串的值，也就是值列表

```
@each $animal in puma, sea-slug, egret, salamander {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}
```

### @while

```
$i: 6;
@while $i > 0 {
  .item-#{$i} { width: 2em * $i; }
  $i: $i - 2;
}
```

### @mixin(@include)

为便于书写，`@mixin` 可以用 `=` 表示，而 `@include` 可以用 `+` 表示

```
@mixin silly-links {
  a {
    color: blue;
    background-color: red;
  }
}
div {
    @include silly-links;
}

@mixin sexy-border($color, $width) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p { @include sexy-border(blue, 1in); }
```
