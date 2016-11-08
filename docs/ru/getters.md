
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

Vuex позволяет определять в хранилище "геттеры" (их можно считать вычисляемыми свойствами хранилища). Геттеры получают первым аргументом ссылку на состояние хранилища:

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

Доступ к геттерам происходит через объект `store.getters`:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

В качестве второго аргумента передаётся список всех геттеров:

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

### Вспомогательная Функция `mapGetters`

Хелпер `mapGetters` попросту проксирует геттеры хранилища через локальные вычисляемые свойства компонента:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // примешиваем геттеры в вычисляемые свойства при помощи оператора распространения
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Если вы хотите использовать при проксировании альтернативное имя, примените объектный синтаксис:

``` js
...mapGetters({
  // map this.doneCount to store.getters.doneTodosCount
  doneCount: 'doneTodosCount'
})
```
