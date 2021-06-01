# Suporte ao TypeScript

O Vuex fornece suas tipagens para que você possa usar o TypeScript para escrever uma definição do _store_. Você não precisa de nenhuma configuração especial do TypeScript para Vuex. Por favor siga a [configuração básica do TypeScript no Vue](https://v3.vuejs.org/guide/typescript-support.html) para configurar seu projeto.

No entanto, se você estiver escrevendo seus componentes Vue em TypeScript, há algumas etapas a seguir que exigem que você forneça a tipagem correta para um _store_.

## Tipando a propriedade `$store` no Componente Vue

O Vuex não fornece tipagens para a propriedade `this.$store` _out_ _of_ _the_ _box_. Quando usado com TypeScript, você deve declarar seu próprio _module_ _augmentation_.

Para fazer isso, declare tipagens personalizadas para o `ComponentCustomProperties` do Vue adicionando um arquivo de declaração na pasta do seu projeto:

```ts
// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // declare seus próprios estados do store
  interface State {
    count: number
  }

  // fornece tipagem para `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

## Tipando a Função de Composição `useStore`

Quando você está escrevendo seu componente Vue na API de Composição (ou _Composition_ API), provavelmente desejará que `useStore` retorne o _store_ tipado. Para que `useStore` retorne corretamente o _store_ tipado, você deve:

1. Defina o `InjectionKey` tipado.
2. Forneça o `InjectionKey` tipado ao instalar um _store_ na aplicação Vue.
3. Passe o `InjectionKey` tipado para o método `useStore`.

Vamos abordar isso passo a passo. Primeiro, defina a chave usando a interface `InjectionKey` do Vue junto com sua própria definição de tipo do _store_:

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

// defina suas tipagens para o estado do store
export interface State {
  count: number
}

// defina o injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})
```

Em seguida, passe o _injection_ _key_ definido ao instalar o _store_ para a aplicação Vue:

```ts
// main.ts
import { createApp } from 'vue'
import { store, key } from './store'

const app = createApp({ ... })

// passe o injection key
app.use(store, key)

app.mount('#app')
```

Finalmente, você pode passar a chave para o método `useStore` para recuperar o _store_ tipado.

```ts
// in a vue component
import { useStore } from 'vuex'
import { key } from './store'

export default {
  setup () {
    const store = useStore(key)

    store.state.count // tipado como number
  }
}
```

Por baixo dos panos, o Vuex instala o _store_ para a aplicação Vue usando o [Provide/Inject](https://v3.vuejs.org/api/composition-api.html#provide-inject) do Vue, característica que é a razão pela qual o _injection_ _key_ é um fator importante.

### Simplificando o uso do `useStore`

Ter que importar `InjectionKey` e passá-lo para `useStore` em todos os lugares em que é usado pode rapidamente se tornar uma tarefa repetitiva. Para simplificar as coisas, você pode definir sua própria função combinável (ou _composable_ _function_) para recuperar um _store_ tipado:

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

// defina sua própria função de composição `useStore`
export function useStore () {
  return baseUseStore(key)
}
```

Agora, ao importar sua própria função combinável (ou _composable_ _function_), você pode recuperar o _store_ tipado **sem** ter que fornecer o _injection_ _key_ e ela está tipada:

```ts
// em um componente vue
import { useStore } from './store'

export default {
  setup () {
    const store = useStore()

    store.state.count // tipado como number
  }
}
```
