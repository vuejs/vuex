# Estrutura da Aplicação

O Vuex não restringe realmente como você estrutura seu código. Em vez disso, ele impõe um conjunto de princípios de alto nível:

1. O estado do nível da aplicação é centralizado no _store_.

2. A única maneira de mudar o estado é confirmando (ou fazendo _commit_ das) **mutações**, que são transações síncronas.

3. A lógica assíncrona deve ser encapsulada e pode ser composta com **ações**.

Enquanto você seguir estas regras, depende de você como estruturar seu projeto. Se o arquivo do seu _store_ for muito grande, basta começar a dividir as ações, mutações e _getters_ em arquivos separados.

Para qualquer aplicação mais complexa, provavelmente precisaremos aproveitar os módulos. Aqui está um exemplo de estrutura de projeto:

```bash
├── index.html
├── main.js
├── api
│   └── ... # abstrações para fazer requisições a API
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # onde montamos os módulos e exportamos o store
    ├── actions.js        # ações raiz
    ├── mutations.js      # mutações raiz
    └── modules
        ├── cart.js       # módulo cart
        └── products.js   # módulo products
```

Como referência, confira o [Exemplo do Carrinho de Compras](https://github.com/vuejs/vuex/tree/4.0/examples/classic/shopping-cart).
