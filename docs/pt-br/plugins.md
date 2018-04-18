# Plugins

As stores do Vuex aceitam a opção `plugins` que expõe hooks para cada mutação. Um plugin Vuex é simplesmente uma função que recebe uma store como seu único argumento:


``` js
const myPlugin = store => {
  // chamado quando a store é inicializada
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

### Fazendo Commit de Mutações dentro de Plugins

Plugins não tem permissão para mutar diretamente o estado - similar aos componentes, eles podem apenas disparar mudanças cometendo mutações.

Ao fazer um commit de uma mutação, um plugin pode ser usado para sincronizar uma fonte de dados à store. Por exemplo, para sincronizar uma fonte de dados websocket à store (isso é só um exemplo inventado, na realidade a função `createPlugin` pode receber parâmetros adicionais para tarefas mais complexas):


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

### Gravando Snapshots do Estado

Às vezes, um plugin pode querer receber "snapshots" do estado, e comparar o estado pós-mutação com o pré-mutação. Para conseguir isso, você precisa fzer uma cópia profunda do objeto de estado:


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

**Plugins que tiram snapshots do estado devem ser usados apenas durante o desenvolvimento.** Quando usamos webpack ou Browserify, podemos construir nossas próprias ferramentas que lidam com isso para nós:

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

O plugin vai ser usado por padrão. Para produção, você vai precisar do [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) para webpack ou [envify](https://github.com/hughsk/envify) para Browserify para converter o valor de  `process.env.NODE_ENV !== 'production'` para `false` na build final.

### Plugin de Log Embutido

> Se você está usando [vue-devtools](https://github.com/vuejs/vue-devtools) provavelmente não precisará disso.

Vuex vem com um plugin de log para casos comuns de debug:


``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

A função `createLogger` recebe alguns argumentos:

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

O arquivo de log também pode ser incluído diretamente via tag `<script>` e vai expor a função `createVuexLogger` globalmente.

Perceba que esses plugins tiram snapshots do estado, então use-os apenas durante o desenvolvimento.
