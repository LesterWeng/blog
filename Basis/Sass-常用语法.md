# Sass 常用语法

### 样式嵌套

```scss
label {
  a {
  }
}
```

### 父选择器 &

指向父选择器，编译后会被替换成父选择器，多层嵌套会向下传递

& 必须作为选择器的第一个字符，其后可以跟随后缀生成复合的选择器

```scss
button {
  &:hover {
  }
}

// 复合成 .panel__child
.panel {
  $__child {
  }
}

// 指向选择器本身
.foo.bar .baz.bang,
.bip.qux {
  $selector: &;
}
```

### 属性嵌套

```scss
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

```scss
$default-font-size: 32px;
```

### 函数

```scss
@function px2rem($px) {
  @return $px / $default-font-size * 1rem;
}
```

### 插值语句 #{}

```scss
div {
  width: calc(100% - #{px2rem(50px)});
}
```

### @import

```scss
@import 'foo.scss';
@import 'foo';
@import 'boo.css';
```

### @extend

```scss
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

```scss
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

```scss
@for $i from 1 through 3 {
  .item-#{$i} {
    width: 2em * $i;
  }
}
@for $i from 1 to 3 {
  .item-#{$i} {
    width: 2em * $i;
  }
}
```

### @each

`$var in <list>`
`$var` 可以是任何变量名，比如 `$length`,`<list>` 是一连串的值，也就是值列表

```scss
@each $animal in puma, sea-slug, egret, salamander {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}
```

### @while

```scss
$i: 6;
@while $i > 0 {
  .item-#{$i} {
    width: 2em * $i;
  }
  $i: $i - 2;
}
```

### @mixin(@include)

为便于书写，`@mixin` 可以用 `=` 表示，而 `@include` 可以用 `+` 表示

```scss
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
p {
  @include sexy-border(blue, 1in);
}
```
