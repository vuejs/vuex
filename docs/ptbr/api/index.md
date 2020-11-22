---
sidebar: auto
---

# Referência da API

## Store

### createStore

- `createStore<S>(options: StoreOptions<S>): Store<S>`

  Cria um novo _store_.

  ```js
  import { createStore } from 'vuex'

  const store = createStore({ ...options })
  ```

## Opções do Construtor Store

### state (estado)

- type: `Object | Function`

  O objeto raiz de estado para o _store_ Vuex. [Detalhes](../guide/state.md)

  Se você passar uma função que retorna um objeto, o objeto retornado é usado como o estado raiz. Isso é útil quando você deseja reutilizar o objeto de estado, especialmente para reutilização de módulos. [Detalhes](../guide/modules.md#reutilizacao-do-modulo)

### mutations (mutações)

- type: `{ [type: string]: Function }`

  Registra mutações no _store_. A função do manipulador sempre recebe _state_ como o 1º argumento (será o estado local do módulo se definido em um módulo) e receberá um 2º argumento _payload_ se houver um.

  [Detalhes](../guide/mutations.md)

### actions (ações)

- type: `{ [type: string]: Function }`

  Registra ações no _store_. A função do manipulador recebe um objeto _context_ que expõe as seguintes propriedades:

  ```js
  {
    state,      // o mesmo que `store.state`, ou estado local se estiver em módulos
    rootState,  // o mesmo que `store.state`, apenas em módulos
    commit,     // o mesmo que `store.commit`
    dispatch,   // o mesmo que `store.dispatch`
    getters,    // o mesmo que `store.getters`, ou getters locais se estiver em módulos
    rootGetters // o mesmo que `store.getters`, apenas em módulos
  }
  ```

  E também recebe um 2º argumento _payload_ se houver um.

  [Detalhes](../guide/actions.md)

### getters

- type: `{ [key: string]: Function }`

  Registra os _getters_ no _store_. A função _getter_ recebe os seguintes argumentos:

  ```
  state,     // será estado local do módulo se definido em um módulo.
  getters    // o mesmo que store.getters
  ```

  Especificamente quando definido em um módulo

  ```
  state,       // será estado local do módulo se definido em um módulo.
  getters,     // módulo de getters locais do módulo atual.
  rootState,   // estado global
  rootGetters  // todos os getters
  ```

  Os _getters_ registrados estão expostos em `store.getters`.

  [Detalhes](../guide/getters.md)

### modules (módulos)

- type: `Object`

  Um objeto contendo sub módulos a serem incorporados no _store_, de forma que:

  ```js
  {
    key: {
      state,
      namespaced?,
      mutations?,
      actions?,
      getters?,
      modules?
    },
    ...
  }
  ```

  Cada módulo pode conter _state_ e _mutations_ semelhantes às opções raiz. O estado de um módulo será anexado ao estado da raiz do _store_ usando a chave do módulo. As mutações e _getters_ de um módulo receberão apenas o estado local do módulo como o 1º argumento em vez do estado da raiz, e as ações do módulo _context.state_ também apontarão para o estado local.

  [Detalhes](../guide/modules.md)

### plugins

- type: `Array<Function>`

  Um _Array_ de funções de plug-in a serem aplicadas no _store_. O plug-in simplesmente recebe o _store_ como o único argumento e pode ouvir mutações (para persistência de dados de saída, registro ou depuração) ou despachar mutações (para dados de entrada, por exemplo, _websockets_ ou _observables_).

  [Detalhes](../guide/plugins.md)

### strict

- type: `boolean`
- default: `false`

  Força o _store_ Vuex a rodar mo modo estrito. No modo estrito, qualquer mutação ao estado do Vuex fora dos manipuladores de mutação acusará um erro.

  [Detalhes](../guide/strict.md)

### devtools

- type: `boolean`

  Ative ou desative o _devtools_ para uma determinada instância Vuex. Passar `false` à instância diz ao _store_ Vuex para não se integrar ao _devtools_. Bem útil quando se tem vários _stores_ em uma _single_ _page_.

  ```js
  {
    devtools: false
  }
  ```

## Propriedades da Instância Store

### state (estado)

- type: `Object`

  O estado raiz. Apenas leitura.

### getters

- type: `Object`

  Expõe os _getters_ registrados. Apenas leitura.

## Métodos da Instância Store

### commit

-  `commit(type: string, payload?: any, options?: Object)`
-  `commit(mutation: Object, options?: Object)`

  Confirma (ou faz um _Commit_ de) uma mutação. _options_ pode ter `root: true` que permite confirmar mutações da raiz em [módulos namespaced](../guide/modules.md#namespacing). [Detalhes](../guide/mutations.md)

### dispatch

-  `dispatch(type: string, payload?: any, options?: Object): Promise<any>`
-  `dispatch(action: Object, options?: Object): Promise<any>`

  Despacha uma ação. _options_ pode ter `root: true` que permite despachar ações para raiz em [módulos namespaced](../guide/modules.md#namespacing). Retorna um _Promise_ que resolve todos os manipuladores de ação acionados. [Detalhes](../guide/actions.md)

### replaceState

-  `replaceState(state: Object)`

  Substitue o estado da raiz do _store_. Use isso apenas para fins de _hydration_ / _time-travel_.

### watch

-  `watch(fn: Function, callback: Function, options?: Object): Function`

  Visualiza de forma reativa um valor de retorno de `fn`, e chama o _callback_ para o retorno de chamada quando o valor for alterado. O `fn` recebe o estado do _store_ como o 1º argumento, e os _getters_ como o 2º argumento. Aceita um objeto de opções opcional que leva as mesmas opções que o [método vm.$watch do Vue](https://vuejs.org/v2/api/#vm-watch).

  Para parar um _watch_, chame a função _unwatch_ retornada.

### subscribe

-  `subscribe(handler: Function, options?: Object): Function`

  Assinatura para as mutações do _store_. O `manipulador` é chamado após cada mutação e recebe o descritor da mutação e o estado pós-mutação como argumentos:

  ```js
  const unsubscribe = store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })

  // you may call unsubscribe to stop the subscription
  unsubscribe()
  ```

  Por padrão, o novo manipulador é adicionado ao final da cadeia, então ele será executado após outros manipuladores que foram adicionados antes. Isso pode ser sobrescrito adicionando `prepend: true` a _options_, que irá adicionar o manipulador ao início da cadeia.

  ```js
  store.subscribe(handler, { prepend: true })
  ```

  O método _subscribe_ retornará uma função _unsubscribe_, que deve ser chamada quando a assinatura não for mais necessária. Por exemplo, você pode assinar um Módulo Vuex e cancelar a assinatura ao cancelar o registro do módulo. Ou você pode chamar _subscribe_ de dentro de um componente Vue e então destruir o componente mais tarde. Nesses casos, você deve se lembrar de cancelar a assinatura manualmente.

  Mais comumente usado em plugins. [Detalhes](../guide/plugins.md)

### subscribeAction

-  `subscribeAction(handler: Function, options?: Object): Function`

  Assinatura para as ações do _store_. O `manipulador` é chamado para cada ação despachada e recebe o descritor da ação e o estado de armazenamento atual como argumentos.
  O método _subscribe_ retornará uma função _unsubscribe_, que deve ser chamada quando a assinatura não for mais necessária. Por exemplo, ao cancelar o registro de um módulo Vuex ou antes de destruir um componente Vue.

  ```js
  const unsubscribe = store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })

  // you may call unsubscribe to stop the subscription
  unsubscribe()
  ```

  Por padrão, o novo manipulador é adicionado ao final da cadeia, então ele será executado após outros manipuladores que foram adicionados antes. Isso pode ser sobrescrito adicionando `prepend: true` a _options_, que irá adicionar o manipulador ao início da cadeia.

  ```js
  store.subscribeAction(handler, { prepend: true })
  ```

  O método _subscribeAction_ retornará uma função _unsubscribe_, que deve ser chamada quando a assinatura não for mais necessária. Por exemplo, você pode assinar um Módulo Vuex e cancelar a assinatura ao cancelar o registro do módulo. Ou você pode chamar _subscribeAction_ de dentro de um componente Vue e então destruir o componente mais tarde. Nesses casos, você deve se lembrar de cancelar a assinatura manualmente.

  _subscribeAction_ também pode especificar se a função manipuladora da assinatura deve ser chamada *antes* ou *depois* de um despacho de ação (o comportamento padrão é *antes*):

  ```js
  store.subscribeAction({
    before: (action, state) => {
      console.log(`before action ${action.type}`)
    },
    after: (action, state) => {
      console.log(`after action ${action.type}`)
    }
  })
  ```

  _subscribeAction_ também pode especificar uma função manipuladora _error_ para capturar um erro lançado quando uma ação é despachada. A função receberá um objeto _error_ como 3º argumento.

  ```js
  store.subscribeAction({
    error: (action, state, error) => {
      console.log(`error action ${action.type}`)
      console.error(error)
    }
  })
  ```

  O método _subscribeAction_ é mais comumente usado em plugins. [Detalhes](../guide/plugins.md)

### registerModule

-  `registerModule(path: string | Array<string>, module: Module, options?: Object)`

  Registra um módulo dinâmico. [Detalhes](../guide/modules.md#registro-de-modulo-dinamico)

  _options_ podem ter `preserveState: true` que permite preservar o estado anterior. Bem útil quando fazemos renderização do lado do servidor (_server-side-rendering_).

### unregisterModule

-  `unregisterModule(path: string | Array<string>)`

  Cancela o registro de um módulo dinâmico. [Detalhes](../guide/modules.md#registro-de-modulo-dinamico)

### hasModule

- `hasModule(path: string | Array<string>): boolean`

  Verifica se o módulo com o nome fornecido já foi registrado. [Detalhes](../guide/modules.md#registro-de-modulo-dinamico)

### hotUpdate

-  `hotUpdate(newOptions: Object)`

  Faz _hot_ _swap_ de novas ações e mutações [Detalhes](../guide/hot-reload.md)

## Métodos Auxiliares de Vinculação aos Componentes

### mapState

-  `mapState(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Cria dados computados do componente que retornam a subárvore do _store_ Vuex. [Detalhes](../guide/state.md#o-auxiliar-mapstate)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](../guide/modules.md#usando-metodos-auxiliares-com-namespace)

  O segundo objeto que compõem os argumentos pode ser uma função. `function(state: any)`

### mapGetters

-  `mapGetters(namespace?: string, map: Array<string> | Object<string>): Object`

  Cria dados computados do componente que retornam o valor calculado de um _getter_. [Detalhes](../guide/getters.md#o-auxiliar-mapgetters)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](../guide/modules.md#usando-metodos-auxiliares-com-namespace)

### mapActions

-  `mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Cria opções de métodos nos componentes que despacham uma ação. [Detalhes](../guide/actions.md#despachando-acoes-em-componentes)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](../guide/modules.md#usando-metodos-auxiliares-com-namespace)

  O segundo objeto que compõem os argumentos pode ser uma função. `function(dispatch: function, ...args: any[])`

### mapMutations

-  `mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Cria opções de métodos nos componentes que confirmam (ou fazem um _commit_ de) uma mutação. [Detalhes](../guide/mutations.md#confirmando-ou-fazendo-commits-de-mutacoes-em-componentes)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](../guide/modules.md#usando-metodos-auxiliares-com-namespace)

  O segundo objeto que compõem os argumentos pode ser uma função. `function(commit: function, ...args: any[])`

### createNamespacedHelpers

-  `createNamespacedHelpers(namespace: string): Object`

  Cria métodos auxiliares de componentes vinculados por um nome. O objeto retornado conterá `mapState`, `mapGetters`, `mapActions` e `mapMutations`, que estão vinculados ao _namespace_ fornecido. [Detalhes](../guide/modules.md#usando-metodos-auxiliares-com-namespace)

## Funções de Composição

### useStore

- `useStore<S = any>(injectKey?: InjectionKey<Store<S>> | string): Store<S>;`

  Busca o _store_ injetado quando chamado dentro do gatilho (ou _hook_) _setup_. Ao usar a API de composição, você pode recuperar o _store_ chamando este método.

  ```js
  import { useStore } from 'vuex'

  export default {
    setup () {
      const store = useStore()
    }
  }
  ```

  Os usuários do TypeScript podem usar uma _injection_ _key_ para recuperar um _store_ tipado. Para que isso funcione, você deve definir a _injection_ _key_ e passá-la junto com o _store_ ao instalar a instância do _store_ na aplicação Vue.

  Primeiro, declare a _injection_ _key_ usando a interface `InjectionKey` do Vue.

  ```ts
  // store.ts
  import { InjectionKey } from 'vue'
  import { createStore, Store } from 'vuex'

  export interface State {
    count: number
  }

  export const key: InjectionKey<Store<State>> = Symbol()

  export const store = createStore<State>({
    state: {
      count: 0
    }
  })
  ```

  Então, passe a _key_ definida como o 2º argumento para o método `app.use`.

  ```ts
  // main.ts
  import { createApp } from 'vue'
  import { store, key } from './store'

  const app = createApp({ ... })

  app.use(store, key)

  app.mount('#app')
  ```

  Finalmente, você pode passar a _key_ para o método _useStore_ para recuperar a instância tipada do _store_.

  ```ts
  // no componente vue
  import { useStore } from 'vuex'
  import { key } from './store'

  export default {
    setup () {
      const store = useStore(key)

      store.state.count // tipado como número
    }
  }
  ```
