# Strict Mode

Para habilitar o modo Strict, simplesmente passe a opção `strict: true` ao criar um armazém Vuex:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

Com o modo strict habilitado, sempre que o estado do Vuex for mutado fora dos handlers de mutação, um erro será disparado. Isso nos garante que todas as mutações do estado possam ser explicitamente rastreada por ferramentas de debug.

### Desenvolvimento vs. Produção

**Não habilite o modo strict quando enviar seu app para produção!** O modo Strict utiliza um estado de ampla "visão" (deep watch) no seu código para garantir que nenhuma mutação inapropriada ocorra - tenha certeza de desabilitar o seu uso para produção para evitar que o seu uso faça com que seu app fique lento.

Assim como os middlewares, nós podemos deixar com que as ferramentas de build do seu código lidem com isso:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
