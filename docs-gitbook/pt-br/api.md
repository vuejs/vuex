# Referência de Api

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store Opções do Construtor

- **state**

  - type: `Object | Function`

    O objeto raiz de estado para o _store_ Vuex. [Detalhes](state.md)

    Se você passar uma função que retorna um objeto, o objeto retornado é usado como o estado da raiz. Isso é útil quando você deseja reutilizar o objeto de estado, especialmente para reutilização de módulos. [Detalhes](modules.md#reutilização-do-módulo)

- **mutações**

  - type: `{ [type: string]: Function }`

    Registra mutações no _store_. A função do manipulador sempre recebe `estado` como o 1º argumento (será o estado local do módulo se definido em um módulo) e receberá um 2º argumento `payload` se houver um.

    [Detalhes](mutations.md)

- **ações**

  - type: `{ [type: string]: Function }`

    Registra ações no _store_. A função do manipulador recebe um objeto `context` que expõe as seguintes propriedades:
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

    [Detalhes](actions.md)

- **_getters_**

  - type: `{ [key: string]: Function }`

    Registra _getters_ no _store_. A função _getter_ recebe os seguintes argumentos:
    ```
    state,     // será o estado local do módulo, se definido em um módulo.
    getters    // o mesmo que `store.getters`
    ```

    Especifique quando definido em um módulo

    ```
    state,       // será o estado local do módulo, se definido em um módulo.

    getters,     // Módulo getters locais do módulo atual
    rootState,   // estado global
    rootGetters  // todos os getters
    ```

    Os _getters_ registrados estão expostos em `store.getters`.

    [Detalhes](getters.md)

- **módulos**

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

    Cada módulo pode conter "estado" e "mutações" semelhantes às opções raiz. O estado de um módulo será anexado ao estado da raiz do _store_ usando a chave do módulo. As mutações e _getters_ de um módulo receberão apenas o estado local do módulo como o 1º argumento em vez do estado da raiz e as ações do módulo `context.state` também apontarão para o estado local.

    [Detalhes](modules.md)

- **plugins**

  - type: `Array<Function>`

	Um array de funções de plugin a serem aplicadas no _store_. O plugin simplesmente recebe o _store_ como o único argumento e pode ouvir mutações (para persistência de dados de saída, log ou depuração) ou mutações de despacho (para dados de entrada, por exemplo, websockets ou observáveis).

    [Detalhes](plugins.md)

- **strict**

  - type: `Boolean`
  - default: `false`

    Força o _store_ Vuex em modo estrito. No modo estrito, qualquer mutação ao estado do Vuex fora dos manipuladores de mutação acusará um erro.

    [Detalhes](strict.md)

### Vuex.Store Propriedades da instância

- **_state_**

  - type: `Object`

    O estado raiz. Apenas leitura.

- **_getters_**

  - type: `Object`

    Expõe os _getters_ registrados. Apenas leitura.

### Vuex.Store Métodos da Instância

- **`commit(type: string, payload?: any, options?: Object) | commit(mutation: Object, options?: Object)`**

  Confirma uma mutação. `options` pode ter `root: true` que permite confirmar mutações da raiz em [módulos namespaced](modules.md#namespacing). [Detalhes](mutations.md)

- **`dispatch(type: string, payload?: any, options?: Object) | dispatch(action: Object, options?: Object)`**

  Despacha uma ação. `options` pode ter `root: true` que permite enviar ações para raiz em [módulos namespaced](modules.md#namespacing). Retorna Promise que resolve todos os manipuladores de ação acionados. [Detalhes](actions.md)

- **`replaceState(state: Object)`**

  Substitua o estado da raiz do _store_. Use isso apenas para fins de _hydration_ / _time-travel_.

- **`watch(getter: Function, cb: Function, options?: Object)`**

  Visualiza de forma reativa um valor de retorno da função _getter_ e chama o callback para o retorno de chamada quando o valor mudar. O _getter_ recebe o estado do _store_ como o 1º argumento e os _getters_ como o 2º argumento. Aceita um objeto de opções opcional que leva as mesmas opções que o método `vm. $ Watch` do Vue.

  Para parar de visualizar, chame para a função do manipulador retornada.

- **`subscribe(handler: Function)`**

  Assina as mutações do _store_. O `handler` é chamado após cada mutação e recebe o descritor de mutação e o estado pós-mutação como argumentos:

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Usado com mais frequência em plugins. [Detalhes](plugins.md)

- **`subscribeAction(handler: Function)`**

  > Novo em 2.5.0

  Assina as ações do _store_. O `handler` é chamado para cada ação despachada e recebe o descritor de ação e o estado atual do _store_ como argumentos:

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  Usado com mais frequência em plugins. [Detalhes](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module, options?: Object)`**

  Registra um módulo dinâmico. [Detalhes](modules.md#registro-de-módulo-dinâmico)

  `options` pode ter `preserveState: true` que permite preservar o estado anterior. Util para renderização server-side.

- **`unregisterModule(path: string | Array<string>)`**

  Cancela o registro de um módulo dinâmico. [Detalhes](modules.md#registro-de-módulo-dinâmico)

- **`hotUpdate(newOptions: Object)`**

  Faz Hot swap de novas ações e mutações. [Detalhes](hot-reload.md)

### Métodos Auxiliares dos Componentes

- **`mapState(namespace?: string, map: Array<string> | Object): Object`**

  Cria componentes computadas de opções que retornam a subárvore do _store_ Vuex. [Detalhes](state.md#o-auxiliar-mapstate)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](modules.md#usando-métodos-auxiliares-com-namespace)

- **`mapGetters(namespace?: string, map: Array<string> | Object): Object`**

  Criar opções computadas do componente que retornam o valor avaliado de um _getter_. [Detalhes](getters.md#o-auxiliar-mapgetters)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](modules.md#usando-métodos-auxiliares-com-namespace)

- **`mapActions(namespace?: string, map: Array<string> | Object): Object`**

  Cria um componente com métodos e opções que despacham uma ação.

[Detalhes](actions.md#ações-de-despacho-em-componentes)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](modules.md#usando-métodos-auxiliares-com-namespace)

- **`mapMutations(namespace?: string, map: Array<string> | Object): Object`**

  Cria um componente com métodos e opções que confirmam uma mutação. [Detalhes](mutations.md#fazendo-commit-de-mutações-em-componente)

  O 1º argumento pode ser opcionalmente uma _String_ com _namespace_. [Detalhes](modules.md#usando-métodos-auxiliares-com-namespace)

- **`createNamespacedHelpers(namespace: string): Object`**

  Cria um componente _namespaced_ dos métodos auxiliares. O objeto retornado possui _mapState_, _mapGetters_, _mapActions_ e _mapMutations_, que estão conectados com o dado _namespace_. [Detalhes](modules.md#usando-métodos-auxiliares-com-namespace)
