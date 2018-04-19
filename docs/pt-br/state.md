# Estado

### �rvore simples de estado

O Vuex usa uma ** �rvore de estado �nico ** - isto �, este �nico objeto cont�m todo o seu n�vel de aplicativo e serve como "fonte �nica de verdade". Isso tamb�m significa que voc� ter� apenas uma loja para cada aplicativo. Uma �nica �rvore de estados torna direto localizar um peda�o de estado espec�fico e nos permite facilmente tirar instant�neos do estado do aplicativo atual para fins de depura��o.

A �rvore de um �nico estado n�o entra em conflito com a modularidade - em cap�tulos posteriores, discutiremos como dividir seu estado e muta��es em sub-m�dulos.
### Obtendo o Vuex State em Vue Components

Ent�o, como exibimos o estado dentro da loja em nossos componentes do Vue? Uma vez que as lojas Vuex s�o reativas, a maneira mais simples de "recuperar" o estado � simplesmente retornar algum estado da loja dentro de uma [propriedade computada](https://vuejs.org/guide/computed.html):

``` js
// vamos criar um componente de contador
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

Sempre que o `store.state.count` muda, far� com que a propriedade computada seja reavaliada e ative as atualiza��es de DOM associadas.
No entanto, esse padr�o faz com que o componente dependa no singleton da loja global. Ao usar um sistema de m�dulo, ele precisa importar a loja em todos os componentes que usam o estado da loja e tamb�m requer mocking ao testar o componente.

O Vuex fornece um mecanismo para "injetar" a loja em todos os componentes filho do componente raiz com a op��o `store` (habilitada por` Vue.use (Vuex) `):
``` js
const app = new Vue({
  el: '#app',
  // forne�a a loja usando a op��o "store".
  // isso ir� injetar a inst�ncia da loja em todos os componentes filho.  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

Ao fornecer a op��o `store` para a inst�ncia raiz, a loja ser� injetada em todos os componentes filho da raiz e estar� dispon�vel neles como esta. $ Store`. Vamos atualizar a nossa implementa��o `Counter`:

``` js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### O auxiliar `mapState`

Quando um componente precisa fazer uso de v�rias propriedades de estado da loja ou getters, declarar que todas essas propriedades computadas podem ser repetitivas e verbosas. Para lidar com isso, podemos usar o ajudante `mapState` que gera fun��es getter computadas para n�s, salvando-nos algumas teclas:

``` js
// em pleno desenvolvimento, os ajudantes s�o expostos como Vuex.mapState
 import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // As fun��es de seta podem tornar o c�digo muito sucinto!    count: state => state.count,

    // passar o valor da string 'count' � o mesmo que `state => state.count`
    countAlias: 'count',

    // para acessar o estado local com `this`, uma fun��o normal deve ser usada
     countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

Tamb�m podemos passar uma matriz de seq��ncia de caracteres para `mapState` quando o nome de uma propriedade calculada mapeada � o mesmo que um nome de �rvore secund�ria de estado.

``` js
computed: mapState([
  // map this.count to store.state.count
  'count'
])
```

### Operador de propaga��o de objetos

Observe que `mapState` retorna um objeto. Como us�-lo em combina��o com outras propriedades locais computadas? Normalmente, ter�amos que usar um utilit�rio para fundir v�rios objetos em um para que possamos passar o objeto final para `computado`. No entanto, com o [operador de propaga��o de objetos](https://github.com/sebmarkbage/ecmascript-rest-spread) (que � uma proposta de ECMAScript em est�gio 3), podemos simplificar muito a sintaxe:

``` js
computed: {
  localComputed () { /* ... */ },
  // Misture isso no objeto externo com o operador de propaga��o do objeto

  ...mapState({
    // ...
  })
}
```

### Componentes ainda podem ter um estado local

O uso do Vuex n�o significa que voc� deve colocar ** all ** no estado no Vuex. Embora colocar mais estado no Vuex torna suas muta��es estatais mais expl�citas e devolv�veis, �s vezes tamb�m pode tornar o c�digo mais detalhado e indireto. Se um peda�o de estado pertence estritamente a um �nico componente, pode ser apenas bom deix�-lo como um estado local. Voc� deve pesar os trade-offs e tomar decis�es que atendam �s necessidades de desenvolvimento do seu aplicativo.
