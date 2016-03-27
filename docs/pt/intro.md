## O que é o Vuex?

Vuex é uma arquitetura de aplicações para gerenciamento de estado centralizado em aplicações Vue.js. Foi desenvolvido inspirado no [Flux](https://facebook.github.io/flux/) e também no [Redux](https://github.com/rackt/redux), mas com conceitos simplificados e com uma implementação que foi feita especificamente para utilizar as vantagens do sistema de reatividade do Vue.js

## Por que eu preciso disso?

Se o seu aplicativo for simples, você provavelmente não precisa utilizar o Vuex. Não o aplique prematuramente. Mas se você estiver construindo uma SPA (Single Page Application) de médio a grande porte, é bem provável que você lidará com situações que lhe farão pensar como estruturar sua aplicação fora dos seus componentes Vue. E é aí que o Vuex entra em cena.

Quando utilizamos somente o Vue.js, nós geralmente armazenamos o estado da aplicação "dentro" de nossos componentes. Isso significa que cada componente é dona de uma parte do estado de nossa aplicação, e como resultado disso é que o estado fica espalhado por toda a aplicação. Entretanto, algumas vezes você precisa compartilhar parte do estado com vários componentes. Uma prática muito utilizada é deixar que o componente "emita" um evento para outro componente e compartilhe parte do estado. O problema com esse padrão é que o fluxo de evento dentro de aplicações mais complexas com vários componentes começa a se tornar confuso e difícil de compreender, e isso pode induzir você a erros.

Para lidar com o estado em aplicações complexas, nós precisamos diferenciar o **estado do componente local** e **o estado da aplicação**. O estado da Aplicação não pertence a um componente específico, mas nossos componentes ainda podem observá-lo para realizar updates reativos no DOM. Ao centralizar o seu gerenciamento em um local, nós não precisamos mais emitir eventos para transmitir dados, porque tudo que afeta mais que um componente deve percenter ao estado da Aplicação. Além disso, isso nos permite gravar e inspecionar todas as mutações para compreender melhor as mudanças no estado, e até implementar coisas mais interessantes como o <i>time-travel debugging</i>.

O Vuex também é explícito em relação a como você deve separar a lógica de gerenciamento de estado em diferentes arquivos, porém tem flexibilidade suficiente para que você o aplique em seu código atual.
