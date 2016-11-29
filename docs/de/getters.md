
# Getters

Manchmal ist es nötig abgeleiteten State basierend auf den Store-State zu bearbeiten, zum Beispiel für das Filtern und Zählen von Listelementen:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Wenn mehr als eine Komponente davon Gebrauch macht, muss man entwender die Funktion duplizieren oder es in einen geteilten Helfer extrahieren, um es an mehreren Orten wieder zu importieren. Beide Wege sind nicht ideal.

Vuex ermöglicht die Definition von Getters im Store. Man könnte sie als Computed Properties für den Store ansehen. Getters erhalten den State als ihr erstes Argument:

``` js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

Getters werden im `store.getters`-Objekt freigelegt:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters erhalten auch andere Getters als zweites Argument:

``` js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

Jetzt kann man einfachen Gebrauch von ihnen innerhalb der Komponente machen:

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

### Der `mapGetters`-Helfer

Der `mapGetters`-Helfer verbindet lediglich Store-Getters mit lokalen Computed Properties:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // Mische die Getters in 'computed' mit dem Object Spread Operator.
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Ist ein Getter mit einem anderen Namen gewünscht ist, schreibt man es als Objekt:

``` js
...mapGetters({
  // Binde 'this.doneCount' mit 'store.getters.doneTodosCount'.
  doneCount: 'doneTodosCount'
})
```
