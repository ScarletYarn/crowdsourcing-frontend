# crowdsourcing-frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Trivia

- Using hasOwnProperty from Object

```js
Object.prototype.hasOwnProperty.call(foo, 'bar')
```

- MessageBox in Element-Plus

Types: success / info / warning / error

Colors: green / gray / yellow

- Scroll event not triggered

Set target element style to 

```sass
.scroll-element
	overflow-x: hidden
	overflow-y: scroll
```

Use `DOMElement.scrollTop = 0` to scroll to top at instance or

```js
const app = document.getElementById('app')
const delta = app.scrollTop / 10
const f = () => {
    if (app.scrollTop < delta) app.scrollTop = 0
    else {
        app.scrollTop -= delta
        requestAnimationFrame(f)
    }
}
requestAnimationFrame(f)
```

- `some` method of Array

```js
const array = [1, 2, 3, 4, 5];

// checks whether an element is even
const even = (element) => element % 2 === 0;

console.log(array.some(even));
// expected output: true
```

- Get keys or items from object

```js
// Static methods
Object.entries()
Object.keys()
Object.values()

a = {
  b: 'c'
}

Object.values(a)  // ['c']
```

- Usage of `reduce` function

```js
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15

```

### Bugs

- `el-radio` click event triggered twice

See [here](https://blog.csdn.net/Zhou_xiaoqian/article/details/105847068). 

```vue
<el-radio @click="changeButton($event, 'TRUE')"></el-radio>

async changeButton(e, s) {
  if (e.target.tagName === 'INPUT') return
},
```

- `v-deep` and `/deep/` is deprecated

```css
/* old */
.parent ::v-deep .child {
    ...
}

/* new */
.parent ::v-deep(.child) {
    ...
}
```

- Router error when accessing with ip other than `localhost`

The first component loaded should not use lazy loading.

```js
import Login from '../views/Login.vue'
```

- `chart.js` Error: "bar" is not a registered controller.

First register the components. Refer [here](https://www.chartjs.org/docs/latest/getting-started/v3-migration.html).
