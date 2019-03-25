# Módulos

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKK4psq" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

Devido ao uso de uma única árvore de estado, todo o estado de nossa aplicação está contido dentro de um grande objeto. No entanto, à medida que nosso aplicativo cresce em escala, o _store_ pode ficar realmente inchado.

Para ajudar com isso, o Vuex nos permite dividir nosso _store_ em **módulos**. Cada módulo pode conter seu próprio estado, mutações, ações, _getters_ e até módulos aninhados - é todo o complexo caminho abaixo:

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

Dentro das mutações e _getters_ de um módulo, o 1º argumento recebido será **o estado local do módulo**.

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

Da mesma forma, dentro das ações do módulo, _context.state_ irá expor o estado local, e o estado raiz será exposto como _context.rootState_:

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

Além disso, dentro do módulo _getters_, o estado raiz será exibido como seu 3º argumento:

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

Por padrão, ações, mutações e _getters_ dentro dos módulos ainda são registrados sob o **_namespace_ global** - isso permite que vários módulos reajam ao mesmo tipo de ação/mutação.

Se você quer que seus módulos sejam mais independentes ou reutilizáveis, você pode marcá-los como _namespaced_ com _namespaced: true_. Quando o módulo é registrado, todos os _getters_, ações e mutações serão automaticamente _namespaced_ com base no caminho no qual o módulo está registrado. Por exemplo:

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // module assets
      state: { ... }, // o estado do módulo já está aninhado e não é afetado pela opção de namespace
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

Os _getters_ e as ações _namespaced_ receberão _getters_, _dispatch_ e _commit_ localizados. Em outras palavras, você pode usar os recursos do módulo sem escrever prefixo no mesmo módulo. Alternar entre _namespaced_ ou não, não afeta o código dentro do módulo.

#### Acessando Recursos Globais em Módulos Namespaced

Se você quiser usar estado global e _getters_, _rootState_ e _rootGetters_ são passados como o 3º e 4º argumentos para funções _getter_, e também expostos como propriedades no objeto _context_ passado para funções de ação.

Para despachar ações confirmar (ou fazer um _commit_ de) mutações no _namespace_ global, passe `{root: true}` como o 3º argumento para _dispatch_ e _commit_.

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
      // dispatch e commit também estão localizados para este módulo
      // eles aceitarão a opção `root` para o dispatch/commit da raiz
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

#### Registrar Ação Global em Módulos com Namespaces

Se você quiser registrar ações globais em módulos com namespaces, você pode marcá-lo com _root: true_ e colocar a definição de ação na função _handler_. Por exemplo:

``` js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

#### Usando Métodos Auxiliares com Namespace

Ao vincular um módulo com _namespace_ aos componentes com os auxiliares _mapState_, _mapGetters_, _mapActions_ e _mapMutations_, ele pode ficar um pouco verboso:

``` js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
```

Nesses casos, você pode passar a _String_ do _namespace_ do módulo como o 1º argumento para os auxiliares, de modo que todas as ligações sejam feitas usando esse módulo como o contexto. O acima pode ser simplificado para:

``` js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```

Além disso, você pode criar auxiliares com _namespace_ usando _createNamespacedHelpers_. Ele retorna um objeto com novos métodos auxiliares dos componentes vinculados ao valor do _namespace_ fornecido:

``` js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // procure em `some/nested/module`
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // procure em `some/nested/module`
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

#### Advertência para Desenvolvedores de Plug-ins

Você pode se preocupar com espaços de nomes imprevisíveis para seus módulos quando você cria um [plugin](plugins.md) que fornece os módulos e permite que os usuários os incluam em um _store_ Vuex. Seus módulos também serão _namespaced_ se os usuários do plugin adicionarem seus módulos em um módulo _namespaced_. Para adaptar esta situação, você pode precisar receber um valor de _namespace_ através de uma opção sua no plugin:

``` js
// obtem valor do namespace via opção no plugin
// e retorna a função plugin do Vuex
export function createPlugin (options = {}) {
  return function (store) {
    // add namespace to plugin module's types
    // adicionar namespace aos tipos de módulo do plug-in
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### Registro de Módulo Dinâmico

Você pode registrar um módulo **após** o _store_ ser criado com o método _store.registerModule_:

``` js
// registra um módulo `myModule`
store.registerModule('myModule', {
  // ...
})

// registra um módulo aninhado `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

Os estados do módulo serão expostos como _store.state.myModule_ e _store.state.nested.myModule_.

O registro de módulo dinâmico possibilita que outros plug-ins Vue aproveitem também o Vuex para gerenciamento de estado, anexando um módulo ao _store_ do aplicativo. Por exemplo, a biblioteca [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) integra o vue-router com o vuex gerenciando o estado da rota do aplicativo em um módulo conectado dinamicamente.

Você também pode remover um módulo dinamicamente registrado com o `store.unregisterModule(moduleName)`. Note que você não pode remover módulos estáticos (declarados na criação do _store_) com este método.

#### Preservando o estado

É bem provável que você queira preservar o estado anterior ao registrar um novo módulo, como preservar o estado de um aplicativo Renderizado no Lado do Servidor (_Server_ _Side_ _Rendered_). Você pode fazer isso com a opção `preserveState`:`store.registerModule('a', module, {preserveState: true})`

Quando você informa `preserveState: true`, o módulo é registrado, as ações, mutações e _getters_ são incluídos no _store_, mas o estado não. É assumido que estado da sua _store_ já contém um estado para aquele módulo e você não quer sobrescrevê-lo.

### Reutilização do Módulo

Às vezes, podemos precisar criar várias instâncias de um módulo, por exemplo:

- Criando multiplos _stores_ que usam o mesmo módulo (e.g. Para [evitar Singletons com informações de estado no SSR](https://ssr.vuejs.org/en/structure.html#avoid-stateful-singletons) quando a opção _runInNewContext_ é _false_ ou `'_once_'`);
- Registrar o mesmo módulo várias vezes no mesmo _store_.

Se usarmos um objeto simples para declarar o estado do módulo, esse objeto de estado será compartilhado por referência e causará poluição entre estados de _store_/módulo quando ele sofrer uma mutação.

Este é exatamente o mesmo problema com `data` dentro dos componentes Vue. Então, a solução também é a mesma - use uma função para declarar o estado do módulo (suportado em 2.3.0+):

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
