# Módulos

Devido ao uso de uma árvore de um único estado, todo o estado do nosso aplicativo está contido dentro de um objeto grande. No entanto, à medida que nossa aplicação cresce em escala, a _store_  pode ficar realmente inchada.
Para ajudar com isso, o Vuex nos permite dividir nossa _store_  em **módulos**. Cada módulo pode conter seu próprio estado, mutações, ações, getters e até mesmo módulos aninhados – tudo é "quebrado" daqui pra frente:

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

store.state.a // -> `moduleA`'s state
store.state.b // -> `moduleB`'s state
```

### Estado Local do Módulo

Dentro das mutações e getters de um módulo, o 1º argumento recebido será **o estado local do módulo**.

 ``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // `state` é o estado local do modulo
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

Da mesma forma, dentro das ações do módulo (_actions_), `context.state` irá expor o estado local e o estado da raiz será exposto como `context.rootState`:

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

Além disso, dentro do módulo getters, o estado da raiz será exibido como seu 3º argumento:

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

### Namespacing

Por padrão, ações, mutações e getters dentro de módulos ainda estão registradas no **namespace global** - isso permite que vários módulos reajam com o mesmo tipo de mutação / ação.
Se você deseja que seus módulos sejam mais autônomos ou reutilizáveis, você pode marcá-lo como namespaced com `namespaced: true`. Quando o módulo é registrado, todos os seus getters, ações e mutações serão automaticamente escritos com nomes com base no caminho no qual o módulo está registrado. Por exemplo:

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // module assets
      state: { ... }, // O estado do módulo já está aninhado e não é afetado pela opção de namespaced
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
        // herda o namespace do modulo pai
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // aninhar ainda mais o namespace
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

Os getters e as ações Namespaced receberão `getters`, `dispatch` e `commit` localizados. Em outras palavras, você pode usar os recursos do módulo sem prefixo de escrita no mesmo módulo. Alternar entre namespaced ou não não afeta o código dentro do módulo.

#### Acessando Assets Globais em Módulos Namespaced

Se você quiser usar estado global e getters, `rootState` e `rootGetters` são passados como o 3º e 4º argumentos para funções getter, e também expostos como propriedades no objeto `context` passado para funções de ação.

Para enviar ações ou fazer um commit de mutações no namespace global, passe `{root: true}` como o 3º argumento para `dispatch` e `commit`.

 ``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` está localizado nos getters deste módulo
      // você pode usar rootGetters como 4º argumento de getters
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // despachar e confirmar também estão localizados para este módulo
      // eles aceitarão a opção `root` para o envio / commit da raiz

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

#### Usando Métodos Auxiliares com Namespace

Ao vincular um módulo com namespace aos componentes com os auxiliares `mapState`, `mapGetters`, `mapActions` e `mapMutations`, ele pode ficar um pouco verboso:
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

Nesses casos, você pode passar a string de namespace do módulo como o 1º argumento para os auxiliares para que todas as ligações sejam feitas usando esse módulo como contexto. O anterior pode ser simplificado para:


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

Além disso, você pode criar _helpers_  com nomes usando o `createNamespacedHelpers`. Ele retorna um objeto com novos auxiliares de ligação de componentes que estão vinculados com o valor de namespace fornecido:

``` js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // look up in `some/nested/module`
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // look up in `some/nested/module`
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

#### Advertência para desenvolvedores de plugin
Você pode se preocupar com o namespacing imprevisível para seus módulos quando você cria um [plugin](plugins.md) que fornece os módulos e permite que os usuários os adicionem a uma _store_  Vuex. Seus módulos serão também escritos por namespacing se os usuários do plugin adicionarem seus módulos em um módulo namespace. Para adaptar esta situação, talvez seja necessário receber um valor de namespace através da opção do plugin:

``` js
// pega o valor do namespace via opção de plugin
// e retorna a função de plugin Vuex
export function createPlugin (options = {}) {
  return function (store) {
    // add namespace to plugin module's types
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### Registro de Módulo Dinâmico
Você pode registrar um módulo **após** a _store_  foi criada com o método `store.registerModule`:

``` js
// register a module `myModule`
store.registerModule('myModule', {
  // ...
})

// register a nested module `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

O estado do módulo será exposto como `store.state.myModule` e `store.state.nested.myModule`.
O registro de módulo dinâmico torna possível que outros plugins do Vue também alavancem o Vuex para gerenciamento de estado anexando um módulo à _store_  do aplicativo. Por exemplo, a biblioteca [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) integra vue-router com vuex, gerenciando o estado da rota do aplicativo em um módulo anexado dinamicamente.

Você também pode remover um módulo registrado dinamicamente com `store.unregisterModule (moduleName)`. Observe que você não pode remover módulos estáticos (declarados na criação da _store_ ) com este método.
Pode ser provável que você queira preservar o estado anterior ao registrar um novo módulo, como preservar o estado de um aplicativo Server Side Rendered. Você pode conseguir isso com a opção `preserveState`: `store.registerModule ('a', module, {preserveState: true}) `

### Reutilização do Módulo
Às vezes, talvez precisemos criar várias instâncias de um módulo, por exemplo:

- Criando várias _stores_  que usam o mesmo módulo (por exemplo, para [evitar Singletons com informações de estado no SSR](https://ssr.vuejs.org/en/structure.html#avoid-statelet-singletons) quando a opção `runInNewContext` é `false` ou `'once'`);
- Registre o mesmo módulo várias vezes na mesma _store_ .

Se usarmos um objeto simples para declarar o estado do módulo, esse objeto de estado será compartilhado por referência e causará poluição do estado do armazenamento / módulo quando estiver mutado.
Este é exatamente o mesmo problema com `data` dentro dos componentes do Vue. Portanto, a solução também é a mesma - use uma função para declarar o estado do módulo (suportado em 2.3.0+):

``` js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // mutações, ações, getters...
}
```
