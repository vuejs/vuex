# State

### Single State Tree

Vuex nutzt einen **Single State Tree**. Es ist ein einziges Objekt, welches die Zustände (State) der gesammten App beinhaltet und diese auch als einzige Quelle wiedergibt. Dies bedeutet, dass es einfach ist, einzelne Zustände schnell zu finden und ermöglicht es Schnappschüsse des aktuellen App-Zustands zu erhalten und zu debuggen.

Der Single State Tree steht nicht im Weg der Modularität. In späteren Kapiteln wird erklärt, wie State und Mutations in Untermodule aufgeteilt wird.

### Vuex-State in Vue-Komponenten bringen

Wie stellen wir nun den State in Vue-Komponenten dar? Da Vuex-Store reaktiv ist, ist es am einfachsten den State in einer [Computed Property](http://vuejs.org/guide/computed.html) wiederzugeben:

``` js
// Erstellung einer Counter-Komponente
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

Wenn `store.state.count` sich ändert, wird die Computed Property erneut ausgewertet und aktiviert die zugehörigen DOM-Updates.

Allerdings führt es dazu, dass die Komponente angewiesen auf den globalen Store ist. Bei Nutzung des Modularsystems ist es nun nötig, den Store in jede Komponente zu importieren, die diesen benötigt. Darüberhinaus ist Mocking bei Komponententests notwendig.

Vuex bietet eine Möglichkeit, um den Store in jede Child-Komponente von der Root-Komponente mit der `store`-Option aus zu "injizieren" (aktiviert via `Vue.use(Vuex)`:

``` js
const app = new Vue({
  el: '#app',
  // Stell den Store über die "store"-Option bereit,
  // so wird die Store-Instanz in jede Child-Komponente injiziert.
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

Durch die Bereitstelllung der `store`-Option in der Root-Instanz wird der Store in jede Child-Komponente übertragen und wird in ihnen nutzbar als `this.$store`. Ein Update der Counter-Implementierung:

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

### Der `mapState`-Helfer

Wenn eine Komponente Gebrauch von mehreren State-Eigenschaften oder Getters machen muss, kann es mühsam und unübersichtlich sein alle wiederholt zu schreiben. Um dem entgegenzuwirken, kann man den `mapState`-Helfer nutzen. Dieser generiert berechnete Getter-Funktionen, die uns Tipparbeit ersparen:

``` js
// In Standalone Builds sind Helfer als Vue.mapState erreichbar.
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // Arrow-Funktionen können Code kurz halten!
    count: state => state.count,

    // Übergabe des String-Werts 'count' ist das gleiche wie 'state => state.count'.
    countAlias: 'count',

    // Um lokalen State-Zugang mit 'this' zu erhalten,
    // muss eine normale Funktion genutzt werden
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

Es ist auch möglich einen Array von Strings in `mapState` zu setzen, wenn der Name der Computed Property der gleiche ist wie im State-Tree.

``` js
computed: mapState([
  // Verbinde 'this.count' mit 'store.state.count'.
  'count'
])
```

### Object Spread Operator

Merke, `mapState` gibt ein Objekt wieder. Wie nutzt man es in Kombination mit anderen lokalen Computed Properies? Normalerweise muss ein zusätzlicher Helfer mehrere Objekte zusammensetzen, um letztendlich nur ein Objekt zu verarbeiten.

Allerdings ist es mit dem [Object Spread Operator](https://github.com/sebmarkbage/ecmascript-rest-spread) möglich, diese Arbeit zu vereinfachen:

``` js
computed: {
  localComputed () { /* ... */ },
  // Mix 'localComputed' in das äußere Objekt mit dem Object Spread Operator
  ...mapState({
    // ...
  })
}
```

### Komponenten können immer noch lokalen State haben

Das Nutzen von Vuex bedeutet nicht, man sollte den **gesamten** State dort einfügen. Auch wenn es aussagekräftiger und einfacher zu debuggen ist, wird es manchmal unübsichtlicher und indirekt.

Wenn gewisser State nur zu einer bestimmten Komponente gehört, ist es in der Regel in Ordnung diesen als lokalen State anzulegen. Es ist wichtig dieses abzuwägen, um den Entwicklungsprozess so flüssig wie möglich zu halten.
