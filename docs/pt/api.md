# Referência da API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Opções do Construtor Vuex.Store

- **state**

  - tipo: `Objeto`

    O objeto de estado raíz para o armazém Vuex.

    [Detalhes](state.md)

- **mutations**

  - tipo: `Objeto`

    Um objeto onde cada entrada é o nome de uma mutação e o valor é uma função, que é o handler. A função handler sempre recebe o `state` (estado) como primeiro parâmetro, e recebe todos os outros parâmetros passados para a chamada da mutação após esse.

    [Detalhes](mutations.md)

- **modules**

  - tipo: `Objeto`

    Um objeto que contém submódulos para serem combinados dentro do armazém, no seguinte formato:

    ``` js
    {
      key: {
        state,
        mutations
      },
      ...
    }
    ```

    Cada módulo pode conter `state` (estado) e `mutations` (mutações) assim como as opções da raíz do Vuex. O estado do módulo será combinado com o estado do armazém principal do Vuex utilizando a opção "modules". As mutações de um módulo somente receberão o estado daquele módulo como primeiro parâmetros, ao invés de todo o estado do armazém.

- **middlewares**

  - tipo: `Array<Objeto>`

    Um array de objetos de middleware que estão no seguinte formato:

    ``` js
    {
      snapshot: Boolean, // padrão: false
      onInit: Function,
      onMutation: Function
    }
    ```

    Todos os campos são opcionais. [Detalhes](middlewares.md)

- **strict**

  - tipo: `Boolean`
  - padrão: `false`

    Força o armazém do Vuex a se comportar com o modo strict. Quando esse módulo está ativado qualquer mutação ao Vuex que são realizadas fora dos handlers das mutações irão disparar um erro.

    [Detalhes](strict.md)

### Propriedades da Instância Vuex.Store

- **state**

  - tipo: `Objeto`

    O estado raíz. Somente leitura.

### Métodos da Instância Vuex.Store

- **dispatch(mutationName: String, ...args)**

  Dispara diretamente uma mutação. Isso é útil em algumas situações, mas geralmente você ira preferir utilizar as ações no seu código.

- **watch(pathOrGetter: String|Function, cb: Function, [options: Object])**

  Observa um caminho ou o valor de uma função getter, e chama o callback quando o valor é modificado. Aceita opções não obrigatórias idênticas ao do método `vm.$watch` do Vue.

  Para finalizar a observação, chame a função de retorno.

- **hotUpdate(newOptions: Object)**

  Atualização em tempo real de ações e mutações. [Detalhes](hot-reload.md)
