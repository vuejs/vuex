# M�dulos

Devido ao uso de uma �rvore de um �nico estado, todo o estado do nosso aplicativo est� contido dentro de um objeto grande. No entanto, � medida que nossa aplica��o cresce em escala, a loja pode ficar realmente inchada.
Para ajudar com isso, o Vuex nos permite dividir nossa loja em ** m�dulos **. Cada m�dulo pode conter seu pr�prio estado, muta��es, a��es, getters e at� mesmo m�dulos aninhados � tudo � fractal daqui pra frente:
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

### Estado do local do modulo

Dentro das muta��es e getters de um m�dulo, o primeiro argumento recebido ser� ** o estado local do m�dulo **.

 ``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // `state` � o estado local do modulo
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

Da mesma forma, dentro das a��es do m�dulo, `context.state` ir� expor o estado local e o estado da raiz ser� exposto como` context.rootState`:

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

Al�m disso, dentro do m�dulo getters, o estado da raiz ser� exibido como seu terceiro argumento:

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

Por padr�o, a��es, muta��es e getters dentro de m�dulos ainda est�o registradas no ** namespace global ** - isso permite que v�rios m�dulos reajam com o mesmo tipo de muta��o / a��o.
Se voc� deseja que seus m�dulos sejam mais aut�nomos ou reutiliz�veis, voc� pode marc�-lo como namespaced com `namespaced: true`. Quando o m�dulo � registrado, todos os seus getters, a��es e muta��es ser�o automaticamente escritos com nomes com base no caminho no qual o m�dulo est� registrado. Por exemplo:

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // module assets
      state: { ... }, // O estado do m�dulo j� est� aninhado e n�o � afetado pela op��o de namespaced
       getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // nested modules
      modules: {
        // herda o namespace do modulo pai
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // further nest the namespace
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

Os getters e as a��es Namespaced receber�o "getters`,` dispatch` e `commit` localizados. Em outras palavras, voc� pode usar os recursos do m�dulo sem prefixo de escrita no mesmo m�dulo. Alternar entre namespaced ou n�o n�o afeta o c�digo dentro do m�dulo.

#### Acessando ativos globais em m�dulos de Namespaced

Se voc� quiser usar o estado global e os getters, o `rootState` e` rootGetters` s�o passados ??como os argumentos 3 e 4 para as fun��es getter, e tamb�m expostos como propriedades no objeto `context` passado �s fun��es de a��o.

Para enviar a��es ou comitar muta��es no namespace global, passe `{root: true}` como o 3� argumento para `dispatch 'e' commit '.
 ``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` est� localizado nos getters deste m�dulo
      // voc� pode usar rootGetters como 4� argumento de getters
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // despachar e confirmar tamb�m est�o localizados para este m�dulo   
    // eles aceitar�o a op��o `root` para o envio / commit da raiz

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

#### Ligando Auxiliares com namespace

Ao vincular um m�dulo com namespace aos componentes com os auxiliares `mapState`,` mapGetters`, `mapActions` e` mapMutations`, ele pode ficar um pouco verboso:
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

Nesses casos, voc� pode passar a string de namespace do m�dulo como o primeiro argumento para os auxiliares para que todas as liga��es sejam feitas usando esse m�dulo como contexto. O anterior pode ser simplificado para:


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

Al�m disso, voc� pode criar helpers com nomes usando o `createNamespacedHelpers`. Ele retorna um objeto com novos auxiliares de liga��o de componentes que est�o vinculados com o valor de namespace fornecido:

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

#### Advert�ncia para desenvolvedores de plugin
Voc� pode se preocupar com o namespacing imprevis�vel para seus m�dulos quando voc� cria um [plugin] (plugins.md) que fornece os m�dulos e permite que os usu�rios os adicionem a uma loja Vuex. Seus m�dulos ser�o tamb�m escritos por namespacing se os usu�rios do plugin adicionarem seus m�dulos em um m�dulo namespace. Para adaptar esta situa��o, talvez seja necess�rio receber um valor de namespace atrav�s da op��o do plugin:

``` js
// pega o valor do namespace via op��o de plugin
// e retorna a fun��o de plugin Vuex 
export function createPlugin (options = {}) {
  return function (store) {
    // add namespace to plugin module's types
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### Registro de m�dulo din�mico
Voc� pode registrar um m�dulo ** ap�s ** a loja foi criada com o m�todo `store.registerModule`:

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

O estado do m�dulo ser� exposto como `store.state.myModule` e` store.state.nested.myModule`.
O registro de m�dulo din�mico torna poss�vel que outros plugins do Vue tamb�m alavancem o Vuex para gerenciamento de estado anexando um m�dulo � loja do aplicativo. Por exemplo, a biblioteca [`vuex-router-sync`] (https://github.com/vuejs/vuex-router-sync) integra vue-router com vuex, gerenciando o estado da rota do aplicativo em um m�dulo anexado dinamicamente.

Voc� tamb�m pode remover um m�dulo registrado dinamicamente com `store.unregisterModule (moduleName)`. Observe que voc� n�o pode remover m�dulos est�ticos (declarados na cria��o da loja) com este m�todo.
Pode ser prov�vel que voc� queira preservar o estado anterior ao registrar um novo m�dulo, como preservar o estado de um aplicativo Server Side Rendered. Voc� pode conseguir isso com a op��o `preserveState`:` store.registerModule ('a', module, {preserveState: true}) `

### Reutiliza��o do M�dulo
�s vezes, talvez precisemos criar v�rias inst�ncias de um m�dulo, por exemplo:

- Criando v�rias lojas que usam o mesmo m�dulo (por exemplo, para [evitar singulares est�reis no SSR] (https://ssr.vuejs.org/en/structure.html#avoid-statelet-singletons) quando a op��o `runInNewContext` �` false ou "once");
- Registre o mesmo m�dulo v�rias vezes na mesma loja.

Se usarmos um objeto simples para declarar o estado do m�dulo, esse objeto de estado ser� compartilhado por refer�ncia e causar� polui��o do estado do armazenamento / m�dulo quando estiver mutado.
Este � exatamente o mesmo problema com `data` dentro dos componentes do Vue. Portanto, a solu��o tamb�m � a mesma - use uma fun��o para declarar o estado do m�dulo (suportado em 2.3.0+):

``` js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // muta��es, a��es, getters...
}
```

