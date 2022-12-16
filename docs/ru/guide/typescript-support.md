# Поддержка TypeScript

Vuex предоставляет типизацию, поэтому можно использовать TypeScript при создании хранилища. Специальная конфигурация не требуется. Пожалуйста, следуйте [настройке TypeScript в Vue](https://v3.ru.vuejs.org/ru/guide/typescript-support.html), чтобы настроить проект.

Однако, если писать компоненты Vue на TypeScript, то нужно выполнить несколько шагов, которые требуются для правильного вывода типов хранилища.

## Типизация `$store` свойства в Vue компоненте

Vuex не предоставляет типизацию для свойства `this.$store` из коробки. При использовании с TypeScript, необходимо объявить собственный модуль расширения.

Для этого объявляем пользовательскую типизацию для Vue `ComponentCustomProperties`, добавив файл деклараций в каталог вашего проекта:

```ts
// vuex.d.ts
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // объявляем собственные состояния хранилища
  interface State {
    count: number
  }

  // указываем типизацию для `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

## Типизация функции композиции `useStore` 

При создании компонента Vue в стиле Composition API, скорее всего захочется, чтобы `useStore` возвращал типизированное хранилище. Для этого необходимо:

1. Определить типизированный `InjectionKey`.
2. Указать типизированный `InjectionKey` при установке хранилища в приложение Vue.
3. Передать типизированный `InjectionKey` методу `useStore`.

Давайте разбираться с этим шаг за шагом. Сначала определяем ключ используя Vue интерфейс `InjectionKey` вместе с собственным определением типизации хранилища:

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

// определяем типизацию для состояния хранилища
export interface State {
  count: number
}

// определяем ключ внедрения
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})
```

Затем передаём определённый ключ внедрения при установке хранилища в Vue приложение:

```ts
// main.ts
import { createApp } from 'vue'
import { store, key } from './store'

const app = createApp({ ... })

// передаём ключ внедрения
app.use(store, key)

app.mount('#app')
```

Теперь можно передать ключ методу `useStore` для получения типизированного хранилища.

```ts
// в vue компоненте
import { useStore } from 'vuex'
import { key } from './store'

export default {
  setup () {
    const store = useStore(key)

    store.state.count // типизировано как число
  }
}
```

Под капотом Vuex устанавливает хранилище в приложение Vue, используя функции Vue [Provide/Inject](https://v3.ru.vuejs.org/ru/api/composition-api.html#provide-inject) поэтому ключ внедрения важный фактор.

### Упрощение использования `useStore`

Необходимость импортировать `InjectionKey` и передавать его везде, где используется `useStore` может быстро превратиться в повторяющуюся задачу. Чтобы упростить задачу, определяем собственную функцию композиции для получения типизированного хранилища:

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  count: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})

// определяем собственную функцию композиции `useStore`
export function useStore () {
  return baseUseStore(key)
}
```

Теперь, импортировав собственную функцию композиции, можно получить типизированное хранилище **без необходимости** предоставления ключа внедрения и его типизации:

```ts
// в vue компоненте
import { useStore } from './store'

export default {
  setup () {
    const store = useStore()

    store.state.count // типизировано как число
  }
}
```
