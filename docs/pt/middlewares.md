# Middlewares

Os armazéns Vuex aceitam a opção `middlewares` que expõem hooks para cada mutação (Note que isso é completamente não relacionado aos middlewares Redux). Um middleware Vuex é simplesmente um objeto que implementam algumas funções de hook:

``` js
const myMiddleware = {
  onInit (state, store) {
    // estado inicial do registro
  },
  onMutation (mutation, state, store) {
    // chamado após todas mutações
    // A mutação vem no formato { type, payload }
  }
}
```

E também pode ser utilizado assim:

``` js
const store = new Vuex.Store({
  // ...
  middlewares: [myMiddleware]
})
```

Por padrão, um middleware recebe o objeto `state` real. Um middleware também pode receber o `armazém` (`store`) para disparar mutações. Como os middlewares são primariamente utilizados para debug da sua aplicação ou persistência de dados, eles **não podem modificar o estado**

Algumas vezes um middleware pode querer receber <i>"snapshots"</i> do estado, e também comparar o estádo pós-mutação com o pré-mutação. Esses middlewares precisam declarar a opção `snapshot: true`:

``` js
const myMiddlewareWithSnapshot = {
  snapshot: true,
  onMutation (mutation, nextState, prevState, store) {
    // nextState and prevState are deep-cloned snapshots
    // of the state before and after the mutation.
  }
}
```

**Middlwares que fazem snapshots devem apenas serem utilizados durante desenvolvimento** Quando você estiver utilizando Webpack ou o Browserify, você pode deixar que essas ferramentas cuidem disso para você:

``` js
const store = new Vuex.Store({
  // ...
  middlewares: process.env.NODE_ENV !== 'production'
    ? [myMiddlewareWithSnapshot]
    : []
})
```

O middleware será utilizado por padrão. Para produção, utilize a build descrita [aqui](http://vuejs.org/guide/application.html#Deploying_for_Production) para converter o valor de `process.env.NODE_ENV !== 'production'` para `false` na build final.
### Middleware de Log Padrão

O Vuex já vem com um middleware de log para o uso geral de debug:

``` js
import createLogger from 'vuex/logger'

const store = new Vuex.Store({
  middlewares: [createLogger()]
})
```

A função `createLogger` recebe alguns parâmetros:

``` js
const logger = createLogger({
  collapsed: false, // auto-expand logged mutations
  transformer (state) {
    // transform the state before logging it.
    // for example return only a specific sub-tree
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutations are logged in the format of { type, payload }
    // we can format it anyway we want.
    return mutation.type
  }
})
```

Note que o middleware logger faz <i>snapshots</i> do estado, então utilize-o apenas para desenvolvimento.
