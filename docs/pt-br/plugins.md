# _Plugins_

Os _stores_ do Vuex aceitam a opção _plugins_  que expõe _hooks_  para cada mutação. Um _plugin_  Vuex é simplesmente uma função que recebe um _store_  como seu único argumento:


``` js
const myPlugin = store => {
  // chamado quando o store é inicializado
  store.subscribe((mutation, state) => {
    // chamada após cada mutação
    // a mutação vem no formato `{ type, payload }`.
  })
}
```

E pode ser usada assim:

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### Fazendo _Commit_  de Mutações dentro de _Plugins_

_Plugins_  não tem permissão para mudar diretamente o estado - similar aos componentes, eles podem apenas disparar mudanças fazendo _commit_  de mutações.

Ao fazer um _commit_  de uma mutação, um _plugin_  pode ser usado para sincronizar uma fonte de dados ao _store_ . Por exemplo, para sincronizar uma fonte de dados _websocket_ ao _store_  (isso é só um exemplo inventado, na realidade a função _createPlugin_ pode receber parâmetros adicionais para tarefas mais complexas):


``` js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

``` js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

### Gravando _Snapshots_  do Estado

Às vezes, um _plugin_  pode querer receber _snapshots_  do estado, e comparar o estado pós-mutação com o pré-mutação. Para conseguir isso, você precisa fzer uma cópia profunda do objeto de estado:


``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // compara `prevState` e `nextState`...

    // salva o estado para a próxima mutação
    prevState = nextState
  })
}
```

**_Plugins_  que tiram _snapshots_  do estado devem ser usados apenas durante o desenvolvimento.** Quando usamos _webpack_  ou _Browserify_ , podemos construir nossas próprias ferramentas que lidam com isso para nós:

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

O _plugin_  vai ser usado por padrão. Para produção, você vai precisar do [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) para webpack ou [envify](https://github.com/hughsk/envify) para Browserify para converter o valor de  `process.env.NODE_ENV !== 'production'` para `false` na build final.

### _Plugin_  de _Log_  Embutido

> Se você está usando [vue-devtools](https://github.com/vuejs/vue-devtools) provavelmente não precisará disso.

Vuex vem com um _plugin_  de _log_  para casos comuns de depuração:


``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

A função _createLogger_  recebe alguns argumentos:

``` js
const logger = createLogger({
  collapsed: false, // expande automaticamente funções logadas
  filter (mutation, stateBefore, stateAfter) {
    // retorna `true` se a mutação deve ser logada
    // `mutation` é uma `{ type, payload }`
    return mutation.type !== "aBlacklistedMutation"
  },
  transformer (state) {
    // transforma o estado antes de logá-lo
    // por exemplo, retorna apenas uma sub-árvore específica
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutações são logadas no formato `{ type, payload }`
    // mas podemos formatá-las como quiser.
    return mutation.type
  },
  logger: console, // implementação da API `console`, default `console`
})
```

O arquivo de _log_  também pode ser incluído diretamente via _tag_  `<script>` e vai expor a função `createVuexLogger` globalmente.

Perceba que esses _plugins_  tiram _snapshots_  do estado, então use-os apenas durante o desenvolvimento.
