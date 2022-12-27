# Работа с формами

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKRgEC9" target="_blank" rel="noopener noreferrer">Пройдите этот урок на Scrimba</a></div>

При использовании строгого режима Vuex может показаться неочевидным как использовать `v-model` с частью состояния Vuex:

``` html
<input v-model="obj.message">
```

Предположим, что `obj` — вычисляемое свойство, которое просто возвращает ссылку на объект из хранилища. В таком случае, `v-model` будет пытаться напрямую изменять значение `obj.message` при действиях пользователя. В строгом режиме такие изменения спровоцируют ошибку, поскольку они происходят вне обработчиков мутаций Vuex.

Для работы с Vuex в такой ситуации, следует привязать значение к `<input>` и отслеживать его изменения по событию `input` или `change`:

``` html
<input :value="message" @input="updateMessage">
```

``` js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

А вот и обработчик мутаций:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

## Двунаправленные вычисляемые свойства

Заметно, что получившаяся выше запись — куда многословнее, чем используемая в связке `v-model` с локальным состоянием, да и некоторые полезные возможности `v-model` таким образом упускаются. В качестве альтернативы можно предложить использование двунаправленного вычисляемого свойства с сеттером:

``` html
<input v-model="message">
```

``` js
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```
