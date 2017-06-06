# Referência da API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Opções de Construtor da Vuex.Store

- **state**

  - Tipo: `Object`

    O objeto de estado raiz da sua store Vuex.

    [Detalhes](state.md)

- **mutations**

  - Tipo: `{ [type: string]: Function }`

    Registra mutações no store. A função de handler sempre recebe o `state` como o primeiro argumento (seria o estado local do módulo se fosse definido em um módulo), e recebe o segundo argumento como `payload` se houver um..

    [Detalhes](mutations.md)

- **actions**

  - Tipo: `{ [type: string]: Function }`

    Registra ações no store. A função handler recebe um  objeto `context` que expõe as seguintes propriedades:
    

    ``` js
    {
      state,     // o mesmo que store.state, ou estado local em módulos
      rootState, // o mesmo que store.state, apenas em módulos
      commit,    // o mesmo que store.commit
      dispatch,  // o mesmo que store.dispatch
      getters    // o mesmo que store.getters
    }
    ```

    [Detalhes](actions.md)

- **getters**

  - Tipo: `{ [key: string]: Function }`


    Registra getters no store. A função getter recebe os seguintes argumentos:

    ```
    state,     // seria o estado local do módulo se definido dentro de um módulo
    getters    // o mesmo que store.getters
    ```

    Específicos para quando forem definidos em módulos:

    ```
    state,       // seria o estado local do módulo se definido dentro de um módulo
    getters,     // getters locais do módulo atual
    rootState,   // estado global
    rootGetters  // todos os getters
    ```

    Getters registrados são expostos em `store.getters`.

    [Detalhes](getters.md)

- **modules**

  - Tipo: `Object`
    
    Um objeto contendo sub módulos para serem mesclados na store, na forma de:
    

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
    
    Cada módulo pode conter `state` e `mutations` de forma similar às opções da raiz. O estado do módulo vai ser anexado à estado da raiz da store usando a chave do módulo. As mutações e os getters do módulo  vão receber apenas o estado local do módulo como primeiro argumento ao invés do estado da raiz, e o `context.state` das ações do módulo vão também apontar para o estado local.
    

    [Detalhes](modules.md)

- **plugins**

  - Tipo: `Array<Function>`

    Uma array de funções de plugins que serão aplicadas na store. O plugin simplesmente recebe a store como único argumento, e pode escutar mutações (para persistência de dados externos, logs ou debug) ou despachar mutações (para entrada de dados, tipo websockets ou observáveis).
    

    [Detalhes](plugins.md)

- **strict**

  - Tipo: `Boolean`
  - default: `false`

    Força a store do Vuex a rodar em strict mode. Qualquer mutação ao estado fora de handlers de mutações vão disparar um Error.

    [Detalhes](strict.md)

### Propriedaes da Instância Vuex.Store

- **state**

  - Tipo: `Object`

    O estado raiz. Apenas leitura.

- **getters**

  - Tipo: `Object`

    Expõe os getters registrados. Apenas leitura.

### Métodos da Instância Vuex.Store 

- **`commit(type: string, payload?: any, options?: Object) | commit(mutation: Object, options?: Object)`**

  Comita uma mutação. `options` podem ter `root: true` que permite cometer mutações da raiz em [módulos com namespace](modules.md#namespacing). [Detalhes](mutations.md)

- **`dispatch(type: string, payload?: any, options?: Object) | dispatch(action: Object, options?: Object)`**

  Despacha uma ação. `options` podem ter `root: true` que permitem despachar ações da raiz em [módulos com namespace](modules.md#namespacing). Retorna uma Promise que dispara todos os handlers das ações disparadas. [Detalhes](actions.md)

- **`replaceState(state: Object)`**

  Substitui o estado da raiz da store. Use isso apenas pra fins de hidratação / time travel.
  
- **`watch(getter: Function, cb: Function, options?: Object)`**

  Reativamente observa o valor de retorno de uma função getter, e chama o callback quando o valor é alterado. O getter recebe o estado da store como único argumento. Aceita um objeto opcional de opções que recebe as mesma opções que o  método `vm.$watch` do Vue.

  Para parar de observar, chame a função de handler retornada.

- **`subscribe(handler: Function)`**

  Assina as mutações da loja. O `handler` é chamado após cada mutação e recebe o descritor e o estado pós-mutação como argumentos:
  

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Mais comumente usado em plugins. [Detalhes](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module)`**

  Registra um módulo dinâmico. [Detalhes](modules.md#dynamic-module-registration)

- **`unregisterModule(path: string | Array<string>)`**

  Desregistra um módulo dinâmico. [Detalhes](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  Atualiza as ações e mutações novas via hot reload. [Detalhes](hot-reload.md)

### Helpers para Ligamento de Componentes

- **`mapState(namespace?: string, map: Array<string> | Object): Object`**

  Cria as opções computadas do componente que retornam a sub árvore da store Vuex.  [Detalhes](state.md#the-mapstate-helper)

  O primeiro argumento pode ser opcionalmente a string do namespace. [Detalhes](modules.md#binding-helpers-with-namespace)

- **`mapGetters(namespace?: string, map: Array<string> | Object): Object`**

  Cria as opções computadas do componente que retornam o valor avaliado de um getter. [Detalhes](getters.md#the-mapgetters-helper)

  O primeiro argumento pode ser opcionalmente a string do namespace. [Detalhes](modules.md#binding-helpers-with-namespace)

- **`mapActions(namespace?: string, map: Array<string> | Object): Object`**

  Cria as opções de métodos de componentes que despacham uma ação. [Detalhes](actions.md#dispatching-actions-in-components)

  O primeiro argumento pode ser opcionalmente a string do namespace. [Detalhes](modules.md#binding-helpers-with-namespace)

- **`mapMutations(namespace?: string, map: Array<string> | Object): Object`**

  Cria as opções de métodos de componentes que cometem uma mutação. [Detalhes](mutations.md#commiting-mutations-in-components)

  O primeiro argumento pode ser opcionalmente a string do namespace. [Detalhes](modules.md#binding-helpers-with-namespace)
