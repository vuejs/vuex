---
sidebar: auto
---

# Referência da API

## Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

## Vuex.Store Opções do Construtor

### estado

- type: `Object | Function`

  O objeto raiz de estado para o _store_ Vuex. [Detalhes](../guide/state.md)

  Se você passar uma função que retorna um objeto, o objeto retornado é usado como o estado da raiz. Isso é útil quando você deseja reutilizar o objeto de estado, especialmente para reutilização de módulos. [Detalhes](../guide/modules.md#reutilizacao-do-modulo)

### mutações

- type: `{ [type: string]: Function }`

  Registra mutações no _store_. A função do manipulador sempre recebe `estado` como o 1º argumento (será o estado local do módulo se definido em um módulo) e receberá um 2º argumento _payload_ se houver um.

  [Detalhes](../guide/mutations.md)

### ações

- type: `{ [type: string]: Function }`

  Registra ações no _store_. A função do manipulador recebe um objeto _context_ que expõe as seguintes propriedades:

  ``` js
  {
    state,      // o mesmo que `store.state`, ou estado local se estiver em módulos
    rootState,  // o mesmo que `store.state`, apenas em módulos
    commit,     // o mesmo que `store.commit`
    dispatch,   // o mesmo que `store.dispatch`
    getters,    // o mesmo que `store.getters`, ou com getters locais se estiver em módulos
    rootGetters // o mesmo que `store.getters`, apenas em módulos
  }
  ```

  E também recebe um 2º argumento _payload_ se houver um.

  [Detalhes](../guide/actions.md)

### getters

- type: `{ [key: string]: Function }`

  Registra _getters_ no _store_. A função _getter_ recebe os seguintes argumentos:

  ```
  state,     // será estado local do módulo se definido em um módulo.
  getters    // o mesmo que store.getters
  ```

  Específico quando definido em um módulo

  ```
  state,       // será estado local do módulo se definido em um módulo.
  getters,     // módulo de getters locais do módulo atual
  rootState,   // estado global
  rootGetters  // todos os getters
  ```

  Os _getters_ registrados estão expostos em _store.getters_.

  [Detalhes](../guide/getters.md)

### módulos

- type: `Object`

  Um objeto contendo sub módulos a serem incorporados no _store_, de forma que:

  ``` js
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

  Cada módulo pode conter `estado` e `mutações` semelhantes às opções raiz. O estado de um módulo será anexado ao estado da raiz do _store_ usando a chave do módulo. As mutações e _getters_ de um módulo receberão apenas o estado local do módulo como o 1º argumento em vez do estado da raiz e as ações do módulo _context.state_ também apontarão para o estado local.

  [Detalhes](../guide/modules.md)

### plugins

- type: `Array<Function>`

  Um _Array_ de funções de plug-in a serem aplicadas no _store_. O plug-in simplesmente recebe o _store_ como o único argumento e pode ouvir mutações (para persistência de dados de saída, registro ou depuração) ou mutações de despacho (para dados de entrada, por exemplo, websockets ou _observables_).

  [Detalhes](../guide/plugins.md)

### strict

- type: `Boolean`
- default: `false`

  Força o _store_ Vuex em modo estrito. No modo estrito, qualquer mutação ao estado do Vuex fora dos manipuladores de mutação acusará um erro.

  [Detalhes](../guide/strict.md)

### devtools

- type: `Boolean`

  Ative ou desative as ferramentas de desenvolvedor para uma determinada instância vuex. Passar _false_ à instância diz ao _store_ Vuex para não se integrar ao _devtools_. Útil para quando se tem vários _stores_ em uma _single page_.

  ``` js
  {
    devtools: false
  }
  ```


## Vuex.Store Propriedades da Instância

### state

- type: `Object`

  O estado raiz. Apenas leitura.

### getters

- type: `Object`

  Expõe os _getters_ registrados. Apenas leitura.

## Vuex.Store Métodos da Instância

### commit

-  `commit(type: string, payload?: any, options?: Object)`
-  `commit(mutation: Object, options?: Object)`

  Confirma (ou faz um _Commit_ de) uma mutação. _options_ pode ter _root: true_ que permite confirmar mutações da raiz em [módulos namespaced](../guide/modules.md#namespacing). [Detalhes](../guide/mutations.md)

### dispatch

-  `dispatch(type: string, payload?: any, options?: Object)`
-  `dispatch(action: Object, options?: Object)`

  Despacha uma ação. _options_ pode ter _root: true_ que permite despachar ações para raiz em [módulos namespaced](../guide/modules.md#namespacing). Retorna um _Promise_ que resolve todos os manipuladores de ação acionados. [Detalhes](../guide/actions.md)

### replaceState

-  `replaceState(state: Object)`

  Substitua o estado da raiz do _store_. Use isso apenas para fins de _hydration_ / _time-travel_.

### watch

-  `watch(fn: Function, callback: Function, options?: Object): Function`

  Visualiza de forma reativa um valor de retorno de `fn`, e chama o _callback_ para o retorno de chamada quando o valor for alterado. O `fn` recebe o estado do _store_ como o 1º argumento, e os _getters_ como o 2º argumento. Aceita um objeto de opções opcional que leva as mesmas opções que o método _vm.$watch_ do Vue.

  Para parar um _watch_, chame a função _unwatch_ retornada.

### subscribe

-  `subscribe(handler: Function): Function`

  Assina as mutações do _store_. O `manipulador` é chamado após cada mutação e recebe o descritor de mutação e o estado pós-mutação como argumentos:

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Para cancelar a assinatura, chame a função _unsubscribe_ retornada.

  Mais comumente usado em plugins. [Detalhes](../guide/plugins.md)

### subscribeAction

-  `subscribeAction(handler: Function): Function`

  > Novo na 2.5.0

  Assina as ações do _store_. O `manipulador` é chamado para cada ação despachada e recebe o descritor de ação e o estado atual do _store_ como argumentos:

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  Para cancelar a assinatura, chame a função _unsubscribe_ retornada.

  > Novo na 3.1.0

  A partir da 3.1.0, `subscribeAction` também pode especificar se o manipulador do _subscribe_ deve ser chamado *antes de* ou *depois de* um despacho de ação (o comportamento padrão é *antes*):

  ``` js
  store.subscribeAction({
    before: (action, state) => {
      console.log(`antes da action ${action.type}`)
    },
    after: (action, state) => {
      console.log(`depois da action ${action.type}`)
    }
  })
  ```

  Mais comumente usado em plugins. [Detalhes](../guide/plugins.md)

### registerModule

-  `registerModule(path: string | Array<string>, module: Module, options?: Object)`

  Registra um módulo dinâmico. [Detalhes](../guide/modules.md#registro-de-modulo-dinamico)

  _options_ can have _preserveState: true_ que permite preservar o estado anterior. Útil com renderização do lado do servidor (_server-side-rendering_).

### unregisterModule

-  `unregisterModule(path: string | Array<string>)`

  Cancela o registro de um módulo dinâmico. [Detalhes](../guide/modules.md#registro-de-modulo-dinamico)

### hotUpdate

-  `hotUpdate(newOptions: Object)`

  Faz _Hot_ _swap_ de novas ações e mutações. [Detalhes](../guide/hot-reload.md)

## Métodos Auxiliares dos Componentes

### mapState

-  `mapState(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Criar dados computados do componente que retornam a subárvore do _store_ Vuex. [Detalhes](../guide/state.md#o-auxiliar-mapstate)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](../guide/modules.md#usando-metodos-auxiliares-com-namespace)

  O segundo objeto que compõem os argumentos pode ser uma função. `function(state: any)`

### mapGetters

-  `mapGetters(namespace?: string, map: Array<string> | Object<string>): Object`

  Criar dados computados do componente que retornam o valor calculado de um _getter_. [Detalhes](../guide/getters.md#o-auxiliar-mapgetters)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](../guide/modules.md#usando-metodos-auxiliares-com-namespace)

### mapActions

-  `mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Criar opções de métodos nos componentes que despacham uma ação. [Detalhes](../guide/actions.md#acoes-de-despacho-em-componentes)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](../guide/modules.md#usando-metodos-auxiliares-com-namespace)

  O segundo objeto que compõem os argumentos pode ser uma função. `function(dispatch: function, ...args: any[])`

### mapMutations

-  `mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Criar opções de métodos nos componentes que confirmam (ou fazem um _commit_ de) uma mutação. [Detalhes](../guide/mutations.md#confirmando-ou-fazendo-commits-de-mutacoes-em-componentes)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](../guide/modules.md#usando-metodos-auxiliares-com-namespace)

  O segundo objeto que compõem os argumentos pode ser uma função. `function(commit: function, ...args: any[])`

### createNamespacedHelpers

-  `createNamespacedHelpers(namespace: string): Object`

  Cria um componente _namespaced_ dos métodos auxiliares. O objeto retornado possui _mapState_, _mapGetters_, _mapActions_ e _mapMutations_, que estão conectados com o dado _namespace_. [Detalhes](../guide/modules.md#usando-metodos-auxiliares-com-namespace)
