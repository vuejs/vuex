# Обработка форм

Если вы используете Vuex в strict mode, привязать `v-model` к состоянию, хранимому во Vue, может быть немного непросто:

``` html
<input v-model="obj.message">
```

Предположим, что `obj` — это вычисляемое свойство, возвращающее ссылку на объект из хранилища. В таком случае, `v-model` будет пытаться напрямую изменить значение `obj.message` в ответ на действия пользователя. В strict mode это спровоцирует ошибку, поскольку это изменение происходит вне обработчика мутации Vuex.

Чтобы подружить Vuex с такой ситуацией, следует однонаправленно связать атрибут `value` элемента `<input>` с полем объекта, а для учёта изменений использовать событие `change`:

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

### Двухсторонние вычисляемые свойства

Заметно, что получившаяся выше запись — куда многословнее, чем используемая в связке `v-model` с локальным состоянием, да и некоторые полезные возможности `v-model` мы таким образом упускаем. В качестве альтернативы можно предложить использование двунаправленного вычисляемого свойства с сеттером:

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
