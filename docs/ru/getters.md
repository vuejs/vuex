# Геттеры

Иногда может понадобится доступ к производным данным, основывающимся на состоянии хранилища: например, к отфильтрованной версии списка или количеству элементов в нём:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Если этот функционал требуется более чем одному компоненту, понадобится либо дублировать функцию, либо выносить её в совместно используемый хелпер и импортировать в нескольких местах. Оба эти подхода далеки от идеала.

Vuex позволяет определять в хранилище «геттеры». Вы можете считать их вычисляемыми свойствами для хранилища. Как и вычисляемые свойства, результаты геттера кэшируются, основываясь на своих зависимостях и будут пересчитаны только тогда, когда изменится одна из его зависимостей.

Геттеры получают первым аргументом ссылку на состояние хранилища:

``` js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

Геттеры доступны в `store.getters`:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Вторым аргументом передаётся список всех геттеров:

``` js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

В компонентах геттеры можно использовать например таким образом:

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

Вы также можете передавать аргументы геттерам возвращая функцию. Это особенно полезно, если вы хотите вернуть элемент (или часть элементов) массива по переданному критерию:

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

### Вспомогательная функция `mapGetters`

Хелпер `mapGetters` попросту проксирует геттеры хранилища через локальные вычисляемые свойства компонента:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // примешиваем геттеры в вычисляемые свойства оператором расширения
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Если вы хотите использовать при проксировании другое имя, примените объектный синтаксис:

``` js
...mapGetters({
  // проксируем `this.doneCount` в `store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
