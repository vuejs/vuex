# Composition API

Чтобы получить доступ к хранилищу в хуке `setup`, можно использовать функцию `useStore`. Это эквивалент получения `this.$store` внутри компонента с помощью Options API.

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
  }
}
```

## Доступ к состоянию и геттерам

Чтобы получить доступ к состоянию и геттерам, нужно создать `вычисляемые` ref-ссылки для сохранения реактивности. Это эквивалентно созданию вычисляемых свойств с помощью Options API.

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // доступ к состоянию в вычисляемой функции
      count: computed(() => store.state.count),

      // доступ к геттеру в вычисляемой функции
      double: computed(() => store.getters.double)
    }
  }
}
```

## Доступ к мутациям и действиям

При доступе к мутациям и действиям, можно просто указать методы `commit` и `dispatch` внутри `setup` хука.

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // доступ к мутациям
      increment: () => store.commit('increment'),

      // доступ к действиям
      asyncIncrement: () => store.dispatch('asyncIncrement')
    }
  }
}
```

## Примеры

Ознакомьтесь с [примером Composition API](https://github.com/vuejs/vuex/tree/4.0/examples/composition) чтобы увидеть пример приложения, использующих Vuex и Vue Composition API.
