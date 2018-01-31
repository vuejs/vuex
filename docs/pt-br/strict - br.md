# Modo estrito

Para habilitar o modo estrito, simplesmente passe `strict: true` ao criar uma loja Vuex:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

Em modo estrito, sempre que o estado do Vuex � mutado fora dos manipuladores de muta��o, um erro ser� lan�ado. Isso garante que todas as muta��es do estado possam ser explicitamente rastreadas por ferramentas de depura��o.

### Desenvolvimento vs. Produ��o

** N�o habilite o modo estrito ao implantar para a produ��o! ** O modo estrito executa um observador profundo s�ncrono na �rvore de estados para detectar muta��es inapropriadas e pode ser bastante caro quando voc� faz grande quantidade de muta��es no estado. Certifique-se de deslig�-lo na produ��o para evitar o custo de desempenho.

Semelhante aos plugins, podemos deixar as ferramentas de compila��o lidar com isso:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

