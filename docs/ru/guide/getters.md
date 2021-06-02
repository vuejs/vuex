# Геттеры

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c2Be7TB" target="_blank" rel="noopener noreferrer">Пройдите этот урок на Scrimba</a></div>

Иногда может потребоваться вычислять производное состояние на основе состояния хранилища, например, отфильтровать список и затем подсчитать количество элементов:

```js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Если такие вычисления потребуются более чем в одном компоненте, придётся или дублировать функцию, или выносить её в общий метод, который затем импортировать во всех местах — оба подхода далеки от идеала.

Vuex позволяет определять «геттеры» в хранилище. Можете считать их вычисляемыми свойствами хранилища. Как и вычисляемые свойства, результаты геттера кэшируются, на основе его зависимостей и пересчитываются только при изменении одной из зависимостей.

Геттеры получают состояние хранилища первым аргументом:

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done);
    }
  }
});
```

## Стиль обращения как к свойствам

Геттеры доступны в объекте `store.getters`, и вы можете получить доступ к значениям как свойствам:

```js
store.getters.doneTodos; // -> [{ id: 1, text: '...', done: true }]
```

Вторым аргументом передаются другие геттеры:

```js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length;
  }
}
```

```js
store.getters.doneTodosCount; // -> 1
```

Теперь можно легко использовать его внутри любого компонента:

```js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

Обратите внимание, что геттеры, доступ к которым выполняется как к свойствам, будут кэшироваться как часть системы реактивности Vue.

## Стиль обращения как к методам

Можно также передавать аргументы геттерам, возвращая функцию. Это например пригодится, когда необходимо возвращать массив по указанному критерию:

```js
getters: {
  // ...
  getTodoById: state => id => {
    return state.todos.find(todo => todo.id === id);
  }
}
```

```js
store.getters.getTodoById(2); // -> { id: 2, text: '...', done: false }
```

Обратите внимание, что геттеры, доступ к которым выполняется как к методам, будут запускаться каждый раз при их вызове, а результаты не будут кэшироваться.

## Вспомогательная функция `mapGetters`

Функция `mapGetters` просто проксирует геттеры хранилища в локальные вычисляемые свойства компонента:

```js
import { mapGetters } from 'vuex';

export default {
  // ...
  computed: {
    // смешиваем результат mapGetters с внешним объектом computed
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter'
      // ...
    ])
  }
};
```

Если необходимо указать другое имя, используйте объектный синтаксис:

```js
...mapGetters({
  // проксирует `this.doneCount` в `store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
