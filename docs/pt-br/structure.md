# Estrutura da aplicação

O Vuex não restringe realmente como você estrutura seu código. Em vez disso, ele impõe um conjunto de princípios de alto nível:

1. O estado do nível de aplicativo é centralizado na _store_ .

2. A única maneira de mudar o estado é fazendo commit das **mutações**, que são transações síncronas.

3. A lógica assíncrona deve ser encapsulada e pode ser composta com **ações**.
Enquanto você seguir estas regras, depende de você como estruturar seu projeto. Se o arquivo da sua _store_  for muito grande, basta começar a dividir as ações, mutações e getters em arquivos separados.

Para qualquer aplicativo não trivial, provavelmente precisaremos alavancar módulos. Aqui está uma estrutura de projeto de exemplo:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # abstrações para fazer pedidos de API
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # onde montamos módulos e exportamos a store    ├── actions.js            # ações da raiz
    ├── mutations.js      # mutações da raiz
    └── modules
        ├── cart.js       # modulo cart
        └── products.js   # modulo products
```

Como referência, confira o [Exemplo do carrinho de compras](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart).

