# Módulos

Devido ao fato de usarmos uma única árvore de estado, todo o estado da nossa aplicação vai ser contida em um único objeto enorme. Entretanto, conforme nossa aplicação cresce em escala, a store pode ficar muito inchada.

Para nos ajudar com esse problema, Vuex nos permite dividir nossa store em **módulos**. Cada módulo contém seu próprio estado, mutações, ações, getters e até módulos aninhados - aí é totalmente fractal ladeira abaixo:


``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> estado do `moduleA`
store.state.b // -> estado do `moduleB`
```

### Estado Local de um Módulo

Dentro das mutações e getters de um módulo, o primeiro argumento a ser recebido vai ser o **estado local do módulo**.


``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // `state` é o estado local do módulo
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

De forma similar, dentro das ações de módulos, o `context.state` vai expor o estado local, e o estado da raiz vai ser exposto como `context.rootState`:

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Além disso, dentro dos getters do módulo, o estado da raiz vai estar exposto como seu terceiro argumento:

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### Usando Namespace

Por padrão, ações, mutações e getters dentro de módulos são todos registrados sob o **namespace global** - isso permite que múltiplos módulos reajam ao mesmo tipo de ação/mutação.

Se você quiser que seus módulso sejam mais independentes ou reutilizáveis, você pode colocá-los no namespace com `namespaced: true`. Quando o módulo for registrado, todos os getters, ações e mutações vão estar automaticamente no namespace baseado no caminho que o módulo for registrado. Por exemplo:


``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // assets do módulo
      state: { ... }, // estado do módulo já está aninhado e não é afetado pela opção namespace
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // módulos aninhados
      modules: {
        // herdam o namespace do módulo pai
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // aninha mais distate o namespace
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

Getters e ações dentro de um namespace vão receber `getters`, `dispatch` e `commit` localizados. Em outras palavras, você pode usar os assets do módulo sem escrever seus prefixos no mesmo módulo. Alternar entre namespace ou não não afeta o código dentro do módulo.


#### Acessando Assets Globais dentro de Módulos em Namespaces

Se você quer usar estados e getters globais, `rootState` e `rootGetters` são passados como terceiro e quarto parâmetros para os getters, e também são expostos como propriedades no objeto `context` passado nas funções.

Para despachar ações ou cometer mutações no namespace global, passe `{ root: true }` como terceiro argumento para o  `dispatch` e `commit`.

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` está localizado nos getters do módulo
      // você pode usar rootGetters via 4º parâmetro de getters
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch e commit também são localizados nesse módulo
      // eles aceitam  a opção `root` para o dispatch/commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

#### Ligando Helpers com Namespace


Quando ligamos um módulo em namespace a componentes com os helpers `mapState`, `mapGetters` e `mapMutations`, as coisas podem ficar verbosas:
When binding a namespaced module to components with the `mapState`, `mapGetters`, `mapActions` and `mapMutations` helpers, it can get a bit verbose:

``` js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo',
    'some/nested/module/bar'
  ])
}
```


Nesses casos, você pode passar o namespace do módulo como o primeiro argumento para os helpers, para que todos os ligamentos sejam feitos usando aquele módulo como contexto. O caso acima pode ser simplificado para: 


``` js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo',
    'bar'
  ])
}
```

#### Ressalvas para Desenvolvedores de Plugins

Você deve se importar com namespaces imprevistos para seus módulos quando for criar um [plugin](plugins.md) que fornece os módulos e permite que os usuários os adicionem a store do Vuex. Seus módulos também vão ter namespaces se o usuário do plugin adicionar seus módulos sob um módulo namespaceado. Para adaptar essa situação, pode ser que você precise receber o valor do namespace via a opção plugin.
 

``` js
// recebe o valor do namespace via opção plugin
// e retorna a função do plugin Vuex
export function createPlugin (options = {}) {
  return function (store) {
    // adiciona namespace aos tipos do módulo do plugin
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### Registro Dinâmico de Módulos

Você pode registrar um módulo **após** a store ter sido criada pelo método `store.registerModule`:

``` js
// registra o módulo `myModule`
store.registerModule('myModule', {
  // ...
})

// registra o módulo aninhado `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

O estado do módulo vai ser exposto como `store.state.myModule` e `store.state.nested.myModule`.

Registro dinâmico de módulos torna possível que outros plugins do Vue também usem Vuex para gerenciamento de estado, anexado um módulo à store da aplicação. Por exemplo, a biblioteca [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) integra vue-router com vuex, gerenciando o estado das rotas da aplicação num módulo anexado dinamicamente.
 

Você também pode remover um módulo dinamicamente registrado com `store.unregisterModule(moduleName)`. Perceba que você não pode remover módulos estáticos (declarados na criação da store) com esse método.

### Reusabilidade de Módulos

Às vezes precisamos criar múltiplas instâncias de um módulo, por exemplo:

- Criar múltiplas stores que usam o mesmo modulo (para por exemplo [evitar singletons com estado em SSR](https://ssr.vuejs.org/en/structure.html#avoid-stateful-singletons) quando a opção `runInNewContext` é setada como  `false` ou `'once'`);
- Registrar o mesmo módulo várias vezes na mesma loja.

Se usarmos um objeto puro para declarar o estado de um módulo, esse objeto vai ser compartilhado por referência e causar poluição de estados entre stores/módulos quando for mutado.

Esse é exatamente o mesmo problema com `data` dentro de componentes do Vue, logo, a solução é a mesma - o uso de funções para declarar o estado de módulos (suportado em 2.3.0+):


``` js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // mutations, actions, getters...
}
```
