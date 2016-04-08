# Estrutura da Aplicação

O Vuex não te restringe em como estruturar seu código. Em vez disso, ele impõe um conjunto de princípios de alto nível:

1. O estado da aplicação é mantido no armazém, que é um único objeto.

2. A única maneira de modificar o estado é disparando mutações no armazém.

3. Mutações devem ser síncronas, e o único efeito colateral que elas devem produzir deve ser a mutação do estado.

4. Nós podemos expor uma API de mutação do estado mais expressiva ao definir ações. Ações podem encapsular lógica assíncrona como carregamento de dados, e o único efeito colateral que elas devem produzir é disparar mutações.

5. Componentes usam getters para recuperar estado do armazém, e chamar ações para modificar o estado.

Um fato legal sobre mutações Vuex, ações e getters é que **eles são apenas funções**. Desde que você siga essas regras, você é quem decide como estruturar sua aplicação. Entretando, é bom termos algumas convenções, assim você se torna familiar a outros projetos que utilizem o Vuex. Abaixo você vê algumas opções dependendo do tamanho do seu aplicativo.

### Projeto Simples

Para um projeto simples, nós podemos simplesmente definir o **armazém** e as **ações** em seus respectivos arquivos:

``` bash
.
├── index.html
├── main.js
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── store.js     # exporta todo o armazém (com seu estado inicial e suas mutações)
    └── actions.js   # exporta todas ações
```

Para um exemplo real, veja o exemplo do [Contador](https://github.com/vuejs/vuex/tree/master/examples/counter) ou o exemplo do [TodoMVC](https://github.com/vuejs/vuex/tree/master/examples/todomvc).

Como alternativa, você pode separar as mutações para seu próprio arquivo.

### De médio a grande porte

Para um app não trivial, nós provavelmente queremos dividir o código relacionado ao Vuex em vários "módulos" (comparáveis a "stores" no Flux, e "reducers" no Redux), cada um lidando com uma parte específica da sua aplicação. Cada módulo estará gerenciando uma parte da árvore do estado da aplicação, exportando o estado inicial para aquela parte da aplicação e todas as mutações que são relativas a ela:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # abstrações para realizar requisições para a API
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── actions.js        # exporta todas ações
    ├── store.js          # onde nós reunimos os módulos e exportamos o armazém
    ├── mutation-types.js # constantes
    └── modules
        ├── cart.js       # estados e mutações para o carrinho
        └── products.js   # estados e mutações para os produtos
```

Um módulo se parece com esse exemplo:

``` js
// vuex/modules/products.js
import {
  RECEIVE_PRODUCTS,
  ADD_TO_CART
} from '../mutation-types'

// initial state
const state = {
  all: []
}

// mutações
const mutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.all = products
  },

  [ADD_TO_CART] (state, productId) {
    state.all.find(p => p.id === productId).inventory--
  }
}

export default {
  state,
  mutations
}
```

E no arquivo `vuex/store.js`, nós "juntamos" vários módulos para criar a instância Vuex :

``` js
// vuex/store.js
import Vue from 'vue'
import Vuex from '../../../src'
// importando partes de módulos
import cart from './modules/cart'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  // combinando submódulos
  modules: {
    cart,
    products
  }
})
```

Aqui, o estado inicial para o módulo `cart` será anexado à arvore de estado como `store.state.cart`. Além disso, **todas as mutações definidades em um submódulo somente recebem a parte do estado da aplicação que está associada a elas**. Então mutações definidas no módulo `cart` irão receber `store.state.cart` como seu primeiro parâmetro.

A raíz de uma subárvore de estado não é substituível dentro do próprio módulo. Por exemplo, o código abaixo não funcionaria:

``` js
const mutations = {
  SOME_MUTATION (state) {
    state = { ... }
  }
}
```

Ao invés disso, sempre armazene o estado atual como uma propriedade da raíz da subárvore:

``` js
const mutations = {
  SOME_MUTATION (state) {
    state.value = { ... }
  }
}
```

Como todos os módulos simplesmente exportam objetos e funções, eles são bem simples de testar e manter, e pode utilizar o hot-reload. Você também tem a liberdade de alterar os padrões utilizados aqui para encontrar a estrutura que se encaixe nas suas preferências.

Note que nós não inserimos ações dentro de módulos, porque uma simples ação pode disparar mutações que afetem vários módulos. Também é uma boa ideia desacoplar as ações do seu estado e dos detalhes de implementação das mutações para uma melhor separação de conceitos. Se os arquivos das ações ficarem muito extensos, você pode criar uma pasta e dividir a implementação em pequenos arquivos individuais..

Para um exemplo real, veja o [Exemplo de Carrinho de Compras](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart).
