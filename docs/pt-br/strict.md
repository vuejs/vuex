# Strict Mode (ou Modo Estrito)

Para habilitar o strict mode, simplesmente passe `strict: true` quando for criar a store Vuex:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

No strict mode, toda vez que um estado Vuex é mutado fora de um handler de mutação, um erro vai ser disparado. Isso assegura que todas as mutações de estado sejam explicitamente rastreadas por ferramentas de debug.

### Desenvolvimento Vs. Produção

**Não habilite strict mode quando for dar deploy em produção!** Strict mode roda um watcher síncrono profundo na árvore de estados para detectar mutações inapropriadas, e pode consumir bastante recursos quando você fizer uma quantidade grande de mutações no estado. Assegure-se de desligá-lo em produção para evitar esse gasto em performance.

De forma similar aos plugins, podemos fazer com que nossas ferramentas de build lidem com isso:


``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
