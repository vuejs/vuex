# Plugins

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cvp8ZkCR" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

Os _stores_ do Vuex aceitam a opção _plugins_ que expõe _hooks_ para cada mutação. Um _plugin_ Vuex é simplesmente uma função que recebe um _store_ como seu único argumento:

``` js
const myPlugin = store => {
  // chamado quando o store é inicializado
  store.subscribe((mutation, state) => {
    // chamada após cada mutação.
    // A mutação vem no formato de `{ type, payload }`.
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

### Confirmando (ou fazendo _commit_ de) Mutações Dentro de Plugins

_Plugins_ não tem permissão para alterar o estado diretamente - similar aos componentes, eles podem apenas acionar mudanças fazendo o _commit_ de mutações.

Por fazer _commit_ de mutações, um _plugin_ pode ser usado para sincronizar uma fonte de dados ao _store_. Por exemplo, para sincronizar uma fonte de dados _websocket_ ao _store_ (isso é só um exemplo inventado, na realidade a função _createPlugin_ pode receber parâmetros adicionais para tarefas mais complexas):

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

### Capturando os Momentos do Estado

Às vezes, um _plugin_ pode querer receber "momentos" do estado, e também comparar o estado pós-mutação com o estado de pré-mutação. Para conseguir isso, você precisará realizar uma cópia-profunda do objeto de estado:

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

**_Plugins_ que capturam momentos do estado devem ser usados apenas durante o desenvolvimento.** Quando usamos _webpack_ ou _Browserify_, podemos construir nossas próprias ferramentas _build_ que lidam com isso para nós:

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

O _plugin_ vai ser usado por padrão. Para produção, você vai precisar do [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) para webpack ou [envify](https://github.com/hughsk/envify) para Browserify para converter o valor do `process.env.NODE_ENV !== 'production'` para `false` no _build_ final.

### Plugin de Log Integrado

> Se você está usando [vue-devtools](https://github.com/vuejs/vue-devtools) provavelmente não precisará disso.

Vuex vem com um _plugin_ de _log_ para casos comuns de depuração:

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

A função _createLogger_ tem algumas opções:

``` js
const logger = createLogger({
  collapsed: false, // expande automaticamente mutações registradas no log
  filter (mutation, stateBefore, stateAfter) {
    // retorna `true` se uma mutação deve ser registrada no log
    // `mutation` é um `{ type, payload }`
    return mutation.type !== "aBlocklistedMutation"
  },
  transformer (state) {
    // transforma o estado antes de regitrá-lo no log.
    // por exemplo, retorna apenas uma sub-árvore específica
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutações são registradas no log no formato de `{ type, payload }`
    // mas podemos formatá-las como quisermos.
    return mutation.type
  },
  logger: console, // implementação da API `console`, default `console`
})
```

O arquivo de _log_ também pode ser incluído diretamente via _tag_ `<script>`, e vai expor a função _createVuexLogger_ globalmente.

Perceba que esses _plugins_ capturam momentos do estado, então use-os apenas durante o desenvolvimento.
