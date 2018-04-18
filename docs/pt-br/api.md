# Refer�ncia de Api

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store Op��es do construtor

- **state**

  - type: `Object | Function`

O objeto do estado da raiz para a loja Vuex. [Detalhes] (state.md)
    Se voc� passar uma fun��o que retorna um objeto, o objeto retornado � usado como o estado da raiz. Isso � �til quando voc� deseja reutilizar o objeto de estado, especialmente para reutiliza��o de m�dulos. [Detalhes] (modules.md # m�dulo-reutiliza��o)

- **muta��es**

  - type: `{ [type: string]: Function }`

    Registra muta��es na loja. A fun��o do manipulador sempre recebe `estado` como o primeiro argumento (ser� o estado local do m�dulo se definido em um m�dulo) e receber� um segundo argumento `payload` se houver um.

    [Detalhes](mutations.md)

- **a��es**

  - type: `{ [type: string]: Function }`

    Registra a��es na loja. A fun��o do manipulador recebe um objeto `context` que exp�e as seguintes propriedades:
    ``` js
    {
      state,      // o mesmo que `store.state`, ou estado local se estiver em m�dulos
      rootState,  // o mesmo que `store.state`, apenas em m�dulos
      commit,     // o mesmo que `store.commit`
      dispatch,   // o mesmo que `store.dispatch`
      getters,    // o mesmo que `store.getters`, ou com getters locais se estiver em m�dulos
      rootGetters // o mesmo que `store.getters`, apenas em m�dulos
    }
    ```

    [Detalhes](actions.md)

- **getters**

  - type: `{ [key: string]: Function }`

    Registra getters na loja. A fun��o getter recebe os seguintes argumentos:
    ```
    state,     // ser� o estado local do m�dulo, se definido em um m�dulo.
    getters    // o mesmo que store.getters
    ```

    Especifique quando definido em um m�dulo

    ```
    state,       // ser� o estado local do m�dulo, se definido em um m�dulo.

    getters,     // M�dulo getters locais do m�dulo atual
    rootState,   // estado global
    rootGetters  // todos os getters
    ```

    Os getters registrados est�o expostos em `store.getters`.

    [Detalhes](getters.md)

- **m�dulos**

  - type: `Object`

    Um objeto contendo sub m�dulos a serem incorporados na loja, de forma que:
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

    Cada m�dulo pode conter "estado" e "muta��es" semelhantes �s op��es raiz. O estado de um m�dulo ser� anexado ao estado da raiz da loja usando a chave do m�dulo. As muta��es e getters de um m�dulo receber�o apenas o estado local do m�dulo como o primeiro argumento em vez do estado da raiz e as a��es do m�dulo 'context.state` tamb�m apontar�o para o estado local.

    [Detalhes](modules.md)

- **plugins**

  - type: `Array<Function>`

	Um array de fun��es de plugin a serem aplicadas na loja. O plugin simplesmente recebe a loja como o �nico argumento e pode ouvir muta��es (para persist�ncia de dados de sa�da, log ou depura��o) ou muta��es de despacho (para dados de entrada, por exemplo, websockets ou observ�veis).

    [Detalhes](plugins.md)

- **strict**

  - type: `Boolean`
  - default: `false`

    For�a a loja Vuex em modo estrito. No modo estrito, qualquer muta��o ao estado do Vuex fora dos manipuladores de muta��o acusar� um erro.

    [Detalhes](strict.md)

### Vuex.Store Propriedades da inst�ncia

- **state**

  - type: `Object`

    O estado raiz. Apenas leitura.

- **getters**

  - type: `Object`

    Exp�e os getters registrados. Apenas leitura.

### Vuex.Store M�todos da inst�ncia

- **`commit(type: string, payload?: any, options?: Object) | commit(mutation: Object, options?: Object)`**

  Confirma uma muta��o. `options` pode ter` root: true` que permite confirmar muta��es da raiz em [namespaced modules] (modules.md # namespacing). [Detalhes](mutations.md)

- **`dispatch(type: string, payload?: any, options?: Object) | dispatch(action: Object, options?: Object)`**

  Despacha uma a��o. `options` pode ter `root: true` que permite enviar a��es para raiz em [namespaced modules](modules.md#namespacing). Retorna Promise que resolve todos os manipuladores de a��o acionados. [Detalhes](actions.md)

- **`replaceState(state: Object)`**

  Substitua o estado da raiz da loja. Use isso apenas para fins de hidrata��o / viagem no tempo.

- **`watch(getter: Function, cb: Function, options?: Object)`**

  Visualiza de forma reativa um valor de retorno da fun��o getter e chame o callback para o retorno de chamada quando o valor mudar. O getter recebe o estado da loja como o primeiro argumento e os getters como o segundo argumento. Aceita um objeto de op��es opcional que leva as mesmas op��es que o m�todo `vm. $ Watch` do Vue.

  Para parar de visualizar, chame para a fun��o do manipulador retornada.

- **`subscribe(handler: Function)`**

  Assina as muta��es da loja. O `handler` � chamado ap�s cada muta��o e recebe o descritor de muta��o e o estado p�s-muta��o como argumentos:

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Usado com mais frequ�ncia em plugins. [Detalhes](plugins.md)

- **`subscribeAction(handler: Function)`**

  > Novo em 2.5.0

  Assina as a��es da loja. O `handler` � chamado para cada a��o despachada e recebe o descritor de a��o e o estado atual da loja como argumentos:

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  Usado com mais frequ�ncia em plugins. [Detalhes](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module, options?: Object)`**

  Registra um m�dulo din�mico. [Detalhes](modules.md#dynamic-module-registration)

  `options` pode ter `preserveState: true` que permite preservar o estado anterior. Util para renderiza��o server-side.

- **`unregisterModule(path: string | Array<string>)`**

  Cancela o registro de um m�dulo din�mico. [Detalhes](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  Faz Hot swap de novas a��es e muta��es. [Detalhes](hot-reload.md)

### Component Binding Helpers

- **`mapState(namespace?: string, map: Array<string> | Object): Object`**

  Cria componentes computadas de op��es que retornam a sub�rvore da loja Vuex. [Detalhes](state.md#the-mapstate-helper)

  O primeiro argumnto pode ser opcionalmente uma string com namespace.[Detalhes](modules.md#binding-helpers-with-namespace)

- **`mapGetters(namespace?: string, map: Array<string> | Object): Object`**
 
  Cria componentes computadas de op��es que retornam valor avaliado deo getter. [Detalhes](getters.md#the-mapgetters-helper)

  O primeiro argumento pode ser opcionalmente uma string com namespace.[Detalhes](modules.md#binding-helpers-with-namespace)

- **`mapActions(namespace?: string, map: Array<string> | Object): Object`**

  Cria um componente com m�todos e op��es que despacham uma a��o.

[Detalhes](actions.md#dispatching-actions-in-components)

  O primeiro argumento pode ser opcionalmente uma string com namespace. [Detalhes](modules.md#binding-helpers-with-namespace)

- **`mapMutations(namespace?: string, map: Array<string> | Object): Object`**

  Cria um componente com m�todos e op��es que confirmam uma muta��o. [Detalhes](mutations.md#committing-mutations-in-components)

  O primeiro argumento pode ser opcionalmente uma string com namespace. [Detalhes](modules.md#binding-helpers-with-namespace)

- **`createNamespacedHelpers(namespace: string): Object`**

  Cria um component namespaced ajudante de liga��o . O objeto retornado possui  `mapState`, `mapGetters`, `mapActions` e `mapMutations`, que est�o conectados com o namespace dado. [Detalhes](modules.md#binding-helpers-with-namespace)


