# API de composition

Pour accéder au store dans le hook `setup`, vous pouvez appeler la fonction `useStore`. C'est l'équivalent de la récupération de `this.$store` dans un composant en utilisant l'API Option.

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
  }
}
```

## Accéder à l'état et aux getters

Afin d'accéder à l'état et aux getters, vous voudrez créer des références `computed` pour conserver la réactivité. Ceci est l'équivalent de la création de propriétés calculées en utilisant l'API Option.

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // accéder à un état dans une fonction calculée
      count: computed(() => store.state.count),

      // accès à un getter dans une fonction calculée
      double: computed(() => store.getters.double)
    }
  }
}
```

## Accéder aux mutations et aux actions

Pour accéder aux mutations et aux actions, vous pouvez simplement fournir les méthodes `commit` et `dispatch` à l'intérieur du hook `setup`.

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // accéder à une mutation
      increment: () => store.commit('increment'),

      // accéder à une action
      asyncIncrement: () => store.dispatch('asyncIncrement')
    }
  }
}
```

## Exemples

Consultez le [Composition API example](https://github.com/vuejs/vuex/tree/4.0/examples/composition) pour voir des exemples d'applications utilisant Vuex et l'API de composition de Vue.
