# Modo estrito

Para habilitar o modo estrito, simplesmente passe `strict: true` ao criar uma loja Vuex:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

Em modo estrito, sempre que o estado do Vuex é mutado fora dos manipuladores de mutação, um erro será lançado. Isso garante que todas as mutações do estado possam ser explicitamente rastreadas por ferramentas de depuração.

### Desenvolvimento vs. Produção

** Não habilite o modo estrito ao implantar para a produção! ** O modo estrito executa um observador profundo síncrono na árvore de estados para detectar mutações inapropriadas e pode ser bastante caro quando você faz grande quantidade de mutações no estado. Certifique-se de desligá-lo na produção para evitar o custo de desempenho.

Semelhante aos plugins, podemos deixar as ferramentas de compilação lidar com isso:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

