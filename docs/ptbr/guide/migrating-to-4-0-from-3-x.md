# Migrando para versão 4.0 da versão 3.x

Quase todas as APIs do Vuex 4 permaneceram inalteradas desde o Vuex 3. No entanto, ainda existem algumas mudanças importantes que você deve corrigir.

- [Alterações Importantes](#alterações-importantes)
  - [Processo de instalação](#processo-de-instalação)
  - [Suporte ao TypeScript](#suporte-ao-typescript)
  - [Os pacotes agora estão alinhados com Vue 3](#os-pacotes-agora-estão-alinhados-com-vue-3)
  - [A função "createLogger" é exportada do módulo principal](#a-função-createLogger-é-exportada-do-módulo-principal)
- [Novas Características](#novas-características)
  - [Nova função de composição "useStore"](#nova-função-de-composição-useStore)

## Alterações Importantes

### Processo de instalação

Para alinhar com o novo processo de inicialização do Vue 3, o processo de instalação do Vuex mudou. Para criar um novo _store_, os usuários agora são incentivados a usar a função createStore recém-introduzida.

```js
import { createStore } from 'vuex'

export const store = createStore({
  state () {
    return {
      count: 1
    }
  }
})
```

Para instalar Vuex em uma instância Vue, passe o `store` em vez do Vuex.

```js
import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'

const app = createApp(App)

app.use(store)

app.mount('#app')
```

:::tip NOTE
Embora esta não seja tecnicamente uma alteração importante, você ainda pode usar a sintaxe `new Store(...)`, recomendamos esta abordagem para alinhar com Vue 3 e Vue Router Next.
:::

### Suporte ao TypeScript

Vuex 4 remove suas tipagens globais para `this.$store` dentro de um componente Vue para resolver essa [issue #994](https://github.com/vuejs/vuex/issues/994). Quando usado com TypeScript, você deve declarar seu próprio _module augmentation_.

Coloque o seguinte código em seu projeto para permitir que `this.$store` seja tipado corretamente:

```ts
// vuex-shim.d.ts

import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // Declare seus próprios estados do store
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

Você pode aprender mais na seção [suporte ao TypeScript](./typescript-support).

### Os pacotes agora estão alinhados com Vue 3

Os seguintes pacotes são gerados para se alinhar aos pacotes Vue 3:

- `vuex.global(.prod).js`
  - Para uso direto com `<script src="...">` no navegador. Expõe o Vuex global.
  - A distribuição (ou _build_) global é construída como IIFE, e não UMD, e destina-se apenas ao uso direto com `<script src="...">`.
  - Contém branches chumbadas no código (ou _hard-coded_) de prod/dev e a compilação de prod é pré-minificada. Use os arquivos `.prod.js` para produção.
- `vuex.esm-browser(.prod).js`
  - Para uso com importações de módulo ES nativo (incluindo navegadores de suporte de módulo via `<script type="module">`.
- `vuex.esm-bundler.js`
  - Para uso com empacotadores como `webpack`, `rollup` e `parcel`.
  - Deixa os branches de prod/dev com os guardas de tipo `process.env.NODE_ENV` (deve ser substituído pelo empacotador).
  - Does not ship minified builds (to be done together with the rest of the code after bundling).
  - Não envia distribuições (ou _builds_) minificados (para ser feito junto com o resto do código após o empacotamento).
- `vuex.cjs.js`
  - Para uso em renderização do lado do servidor (_server-side_ _rendering_) no Node.js com `require()`.

### A função `createLogger` é exportada do módulo principal

No Vuex 3, a função `createLogger` foi exportada de `vuex/dist/logger`, mas agora está incluída no pacote principal. A função deve ser importada diretamente do pacote `vuex`.

```js
import { createLogger } from 'vuex'
```

## Novas Características

### Nova função de composição `useStore`

Vuex 4 apresenta uma nova API para interagir com o _store_ na API de composição (ou _Composition_ API). Você pode usar a função de composição `useStore` para recuperar o _store_ dentro do gatilho (ou _hook_) `setup` do componente.

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
  }
}
```

Você pode aprender mais na seção [API de Composição](./composition-api).
