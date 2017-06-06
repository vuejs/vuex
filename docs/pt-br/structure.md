# Estrutura da Aplicação

Vuex não restringe de fato como você deve estruturar seu código. Ao invés disso, ele reforça uma série de princípios de alto-nível:

1. Estado a nível de aplicação é centralizado na store.

2. A única forma de mutar os estados é comitando **mutações**, que são transações síncronas.

3. Lógica assíncrona deve ser encapsulada em, e composta por **ações**.

Contando que você siga essas regras, você quem decide como estruturar seu projeto. Se seu projeto ficar muito grande, simplesmente comece a dividir as ações, mutações e getters em arquivos separados.

Para qualquer aplicação não-trivial, provavelmente precisaremos alavancar módulos. A seguir um exemplo de estrutura de projeto:


``` bash
├── index.html
├── main.js
├── api
│   └── ... # abstrações para fazer requisições à API
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # onde montamos os módulos e exportamos a store
    ├── actions.js        # ações da raiz
    ├── mutations.js      # mutações da raiz
    └── modules
        ├── cart.js       # módulo de carrinho
        └── products.js   # módulo de produtos
```

Como referência, dê uma olhada no [Exemplo do Carrinho de Compras](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart).
