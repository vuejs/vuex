# Действия

Действия — похожи на мутации с несколькими отличиями:

- Вместо того, чтобы напрямую менять состояние, действия инициируют мутации;
- Действия могут использоваться для асинхронных операций.

Зарегистрируем простое действие:

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Обработчики действий получают объект контекста, содержащий те же методы и свойства, что и сам экземпляр хранилища, так что вы можете вызвать `context.commit` для инициирования мутации или обратиться к состоянию и геттерам через `context.state` и `context.getters`. Позднее при рассмотрении [Модулей](modules.md) мы увидим, однако, что этот контекст — не то же самое, что экземпляр хранилища.

На практике для упрощения кода часто используется [деструктуризация аргументов](https://github.com/lukehoban/es6features#destructuring) из ES2015 (особенно при необходимости многократного вызова `commit`):

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Диспетчеризация действий

Действия запускаются методом `store.dispatch`:

``` js
store.dispatch('increment')
```

На первый взгляд может выглядеть глупо: если мы хотим инкрементировать переменную count, почему бы просто не вызвать `store.commit('increment')` напрямую? Запомните, что **мутации должны быть синхронными**. Действия же этим ограничением не скованы. Внутри действия можно выполнять **асинхронные** операции:

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Диспетчеризация действий поддерживает тот же объектный синтаксис, что и диспетчеризация мутаций:

``` js
// параметризированный вызов
store.dispatch('incrementAsync', {
  amount: 10
})

// объектный синтаксис
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Более приближённым к реальности примером действий будет формирование заказа на основе состояния корзины покупок. Логика такого действия включает в себя **вызов асинхронного API** и **инициализацию нескольких мутаций**:

``` js
actions: {
  checkout ({ commit, state }, products) {
    // сохраним находящиеся на данный момент в корзине товары
    const savedCartItems = [...state.cart.added]
    // инициируем запрос и "оптимистично" очистим корзину
    commit(types.CHECKOUT_REQUEST)
    // предположим, что API магазина позволяет передать коллбэки
    // для обработки успеха и неудачи при формировании заказа
    shop.buyProducts(
      products,
      // обработка успешного исхода
      () => commit(types.CHECKOUT_SUCCESS),
      // обработка неудачного исхода
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Таким образом удаётся организовать поток асинхронных операций, записывая побочные эффекты действий в виде мутаций состояния.

### Диспетчеризация действий в компонентах

Диспетчеризировать действия в компонентах можно при помощи `this.$store.dispatch('xxx')` или используя вспомогательную функцию `mapActions`, создающую локальные псевдонимы для действий в виде методов компонента (требуется наличие корневого `$store`):

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // проксирует `this.increment()` в `this.$store.dispatch('increment')`

      // `mapActions` также поддерживают нагрузку (payloads):
      'incrementBy' // проксирует `this.incrementBy(amount)` в `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // проксирует `this.add()` в `this.$store.dispatch('increment')`
    })
  }
}
```

### Композиция действий

Раз действия зачастую асинхронны, то как узнать, что действие уже завершилось? И, что важнее, как быть со связанными между собой действиями при организации более сложных асинхронных потоков?

Первое, что нужно знать — `store.dispatch` может обрабатывать Promise, возвращаемый обработчиком действия, и также возвращает Promise:

``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

Теперь можно сделать так:

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

А в другом действии — так:

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

Наконец, если мы используем [async / await](https://tc39.github.io/ecmascript-asyncawait/), то можем компоновать наши действия следующим образом:

``` js
// предположим, что `getData()` и `getOtherData()` возвращают Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // дожидаемся завершения действия `actionA`
    commit('gotOtherData', await getOtherData())
  }
}
```

> `store.dispatch` может вызывать несколько обработчиков действий в различных модулях одновременно. В этом случае возвращаемым значением будет Promise, разрешающийся после разрешения всех вызванных обработчиков.
