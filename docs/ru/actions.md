# Действия (Actions)

Действия (actions) похожи на мутации, с тем отличием, что:

- Вместо непосредственного изменения состояния, действия инициируют мутации.
- Действия могут использоваться для асинхронных операций.

Давайте зарегистрируем простое действие:

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

Обработчики действий получают объект контекста, содержащий те же методы и свойства, что и сам инстанс хранилища, так что вы можете вызвать `context.commit` для инициирования мутации, или обратиться к геттерам через `context.state` и `context.getters`. Позднее, при рассмотрении [Модулей](modules.md), мы увидем, однако, что этот контекст — не то же самое, что и сам инстанс хранилища.

На практике для упрощения кода часто используется [деструктуризация аргументов](https://github.com/lukehoban/es6features#destructuring) из ES20115 (особенно при необходимости многократного вызова `commit`):

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Диспетчеризация Действия

Действия запускаются методом `store.dispatch`:

``` js
store.dispatch('increment')
```

На первый взгляд может выглядеть тупо: если мы хотим инкрементировать переменную count, почему бы просто не вызвать `store.commit('increment')` напрямую? Самое время вспомнить, что **мутации обязаны быть синхронными**. Действия же этим ограничением не скованы. Внутри действия можно выполнять **асинхронные** операции:

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Диспетчеризация действий поддерживают такой же объектный синтаксис, как диспетчеризация мутаций:

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

Более приближённым к реальности примером действий будет формирование заказа на основе состояния корзины покупок, чья логика включает **вызов асинхронного API** и **инициализацию нескольких мутаций**:

``` js
actions: {
  checkout ({ commit, state }, payload) {
    // сохраним находящиеся на данный момент в корзине товары
    const savedCartItems = [...state.cart.added]
    // инициируем запрос и "оптимистично" очищаем корзину
    commit(types.CHECKOUT_REQUEST)
    // предположим, что API магазина позволяет передать колбэки
    // на случаи успеха и неудачи при формировании заказа
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

Таким образом удаётся организовать поток асинхронных операций, записывая побочные эффекты действия, вызывая мутации состояния.

### Диспетчеризация Действий в Компонентах

Диспетчеризовать действия в компонентах можно при помощи `this.$store.dispatch('xxx')`, или используя вспомогательную функцию `mapActions`, создающую локальные псевдонимы для действий в виде методов компонента (требуется наличие корневого `$store`):

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // связывает this.increment() с this.$store.dispatch('increment')
    ]),
    ...mapActions({
      add: 'increment' // связывает this.add() с this.$store.dispatch('increment')
    })
  }
}
```

### Композиция Действий

Раз действия зачастую асинхронны, то как можем мы узнать, что действие завершилось? И, что важнее, как организовать связанные действия между собой, чтобы иметь дело с более сложными асинхронными потоками?

Для начала, стоит знать, что `store.dispatch` возвращает значение, возвращённое вызванным обработчиком действия, поэтому мы можем использовать Promise: 

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

И в конце концов, при использовании [async / await](https://tc39.github.io/ecmascript-asyncawait/), функцию JavaScript, которая вот-вот станет общедоступной, станет доступной такая компоновка действий:

``` js
// предположим, что getData() и getOtherData() возвращают Promises

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // дождёмся завершения действия actionA
    commit('gotOtherData', await getOtherData())
  }
}
```

> `store.dispatch` может вызывать несколько обработчиков действий в различных модулях сразу. В этом случае возвращаемым значением будет Promise, разрешающийся после разрешения всех вызванных обработчиков.
