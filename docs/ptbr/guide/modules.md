# Módulos

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKK4psq" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

Devido ao uso de uma única árvore de estado, todos os estados da nossa aplicação estão contidos dentro de um grande objeto. No entanto, à medida que nossa aplicação cresce em escala, o _store_ pode ficar realmente inchado.

Para ajudar com isso, o Vuex nos permite dividir nosso _store_ em **módulos**. Cada módulo pode conter seu próprio estado, mutações, ações, _getters_ e até módulos aninhados - o padrão se repete em todo o fluxo abaixo:

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = createStore({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> `moduleA`'s state
store.state.b // -> `moduleB`'s state
```

## Estado Local do Módulo

Dentro das mutações e _getters_ de um módulo, o 1º argumento recebido será **o estado local do módulo**.

```js
const moduleA = {
  state: () => ({
    count: 0
  }),
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

Da mesma forma, dentro das ações do módulo, `context.state` irá expor o estado local, e o estado raiz será exposto como `context.rootState`:

```js
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

```js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

## Namespacing

Por padrão, ações, mutações e _getters_ dentro dos módulos ainda são registrados sob o **_namespace_ global** - isso permite que vários módulos reajam ao mesmo tipo de ação/mutação.

Se você quer que seus módulos sejam mais independentes ou reutilizáveis, você pode usá-los com _namespaces_ através do `namespaced: true`. Quando o módulo é registrado, todos os _getters_, ações e mutações terão automaticamente o _namespace_ com base no caminho no qual o módulo está registrado. Por exemplo:

```js
const store = createStore({
  modules: {
    account: {
      namespaced: true,

      // recursos do módulo
      state: () => ({ ... }), // o estado do módulo já está aninhado e não é afetado pela opção namespace
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
        // herda o namespace do módulo pai
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // aninhar ainda mais o namespace
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

Os _getters_ e as ações com _namespace_ receberão `getters`, `dispatch` e `commit` localizados. Em outras palavras, você pode usar os recursos do módulo sem escrever prefixo no mesmo módulo. Alternar entre com _namespace_ ou não, não afeta o código dentro do módulo.

### Acessando Recursos Globais em Módulos com Namespaces

Se você quiser usar estado global e _getters_, `rootState` e `rootGetters` são passados como o 3º e 4º argumentos para funções _getter_, e também expostos como propriedades no objeto `context` passado para funções de ação.

Para despachar ações ou confirmar (ou fazer um _commit_ de) mutações no _namespace_ global, passe `{root: true}` como o 3º argumento para `dispatch` e `commit`.

```js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` está localizado nos getters deste módulo
      // você pode usar rootGetters como 4º argumento de getters
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
        rootGetters['bar/someOtherGetter'] // -> 'bar/someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch e commit também estão localizados para este módulo
      // eles aceitarão a opção `root` para o dispatch/commit raiz
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'
        rootGetters['bar/someGetter'] // -> 'bar/someGetter'

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

### Registrar Ação Global em Módulos com Namespaces

Se você quiser registrar ações globais em módulos com _namespaces_, você pode marcá-lo com `root: true` e colocar a definição de ação na função `handler`. Por exemplo:

```js
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

### Vinculando Métodos Auxiliares com Namespace

Ao vincular um módulo com _namespace_ aos componentes com os auxiliares `mapState`, `mapGetters`, `mapActions` e `mapMutations`, ele pode ficar um pouco verboso:

```js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  }),
  ...mapGetters([
    'some/nested/module/someGetter', // -> this['some/nested/module/someGetter']
    'some/nested/module/someOtherGetter', // -> this['some/nested/module/someOtherGetter']
  ])
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
```

Nesses casos, você pode passar a _String_ do _namespace_ do módulo como o 1º argumento para os métodos auxiliares, de modo que todas as ligações sejam feitas usando esse módulo como o contexto. O acima pode ser simplificado para:

```js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  }),
  ...mapGetters('some/nested/module', [
    'someGetter', // -> this.someGetter
    'someOtherGetter', // -> this.someOtherGetter
  ])
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```

Além disso, você pode criar métodos auxiliares com _namespace_ usando `createNamespacedHelpers`. Ele retorna um objeto com novos métodos auxiliares dos componentes vinculados ao valor do _namespace_ fornecido:

```js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // procura em `some/nested/module`
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // procura em `some/nested/module`
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

### Advertência para Desenvolvedores de Plug-ins

Você pode se preocupar com _namespacing_ imprevisível para seus módulos ao criar um [plugin] (plugins.md) que fornece os módulos e permite que os usuários os adicionem a um _store_ Vuex. Seus módulos também terão _namespaces_ se os usuários do _plugin_ adicionarem seus módulos em um módulo com _namespace_. Para se adaptar a essa situação, pode ser necessário receber um valor de _namespace_ por meio das opções do seu _plugin_:

```js
// obtem valor do namespace via opção do plugin
// e retorna a função plugin do Vuex
export function createPlugin (options = {}) {
  return function (store) {
    // adiciona namespace aos tipos de módulos do plugin
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

## Registro de Módulo Dinâmico

Você pode registrar um módulo **após** o _store_ ser criado com o método `store.registerModule`:

```js
import { createStore } from 'vuex'

const store = createStore({ /* options */ })

// registra um módulo `myModule`
store.registerModule('myModule', {
  // ...
})

// registra um módulo aninhado `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

Os estados do módulo serão expostos como `store.state.myModule` e `store.state.nested.myModule`.

O registro de módulo dinâmico possibilita que outros _plugins_ Vue aproveitem também o Vuex para gerenciamento de estado, anexando um módulo ao _store_ da aplicação. Por exemplo, a biblioteca [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) integra o vue-router com o vuex gerenciando o estado da rota do aplicativo em um módulo conectado dinamicamente.

Você também pode remover um módulo dinamicamente registrado com o `store.unregisterModule(moduleName)`. Note que você não pode remover módulos estáticos (declarados na criação do _store_) com este método.

Observe que você pode verificar se o módulo já está registrado no _store_ ou não através do método `store.hasModule (moduleName)`.

### Preservando o estado

É bem provável que você queira preservar o estado anterior ao registrar um novo módulo, como preservar o estado de um aplicativo Renderizado no Lado do Servidor (_Server_ _Side_ _Rendered_). Você pode fazer isso com a opção `preserveState`:`store.registerModule('a', module, {preserveState: true})`

Quando você define `preserveState: true`, o módulo é registrado, as ações, mutações e _getters_ são incluídos no _store_, mas o estado não. É assumido que estado da sua _store_ já contém um estado para aquele módulo e você não quer sobrescrevê-lo.

## Reutilização do Módulo

Às vezes, podemos precisar criar várias instâncias de um módulo, por exemplo:

- Criando múltiplos _stores_ que usam o mesmo módulo (e.g. Para [evitar Singletons com informações do estado no SSR](https://ssr.vuejs.org/en/structure.html#avoid-stateful-singletons) quando a opção `runInNewContext` é `false` ou `'_once_'`);
- Registrar o mesmo módulo várias vezes no mesmo _store_.

Se usarmos um objeto simples para declarar o estado do módulo, esse objeto de estado será compartilhado por referência e causará poluição entre estados de _store_/módulo quando ele sofrer uma mutação.

Este é exatamente o mesmo problema com `data` dentro dos componentes Vue. Então, a solução também é a mesma - use uma função para declarar o estado do módulo (suportado em 2.3.0+):

```js
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  }),
  // mutations, actions, getters...
}
```
