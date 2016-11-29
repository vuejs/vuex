# Erste Schritte

Im Zentrum jeder Vuex-App ist der **Store** (Speicher). Grundsätzlich ist dieser ein Container, der den **State** (Zustand) der App beinhaltet. Es gibt zwei Dinge, die den Vuex-Store von einem banalen Objekt unterscheiden:

1. Vuex-Store ist reaktiv. Wenn Vue-Komponenten State von ihm erhalten, werden sie reaktionsfähig und effizient aktualisiert, wenn der State im Store verändert wird.

2. Es ist nicht möglich den State im Store direkt zu manipulieren. Der einzige Weg dies zu tun ist via **Mutation-Committing** (Festlegung von Änderungen). So wird versichert, dass jede State-Änderung eine verfolgbare Spur hinterlässt und ermöglicht den Nutzen von Werkzeugen, um die App besser zu verstehen.

### Der einfachte Store

> Merke: Es wird [ES2015](https://babeljs.io/docs/learn-es2015/) in den Code-Beispielen verwendet.

Nach der [Installation](installation.md) von Vuex können wir den Store erstellen. Recht simpel - stelle lediglich ein initialisiertes State-Objekt und ein paar Mutations bereit:


``` js
// Stell sicher, dass Vue.use(Vuex) aufgerufen wurde,
// wenn ein Modulsystem genutzt wird.

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

Nun kann auf das State-Objekt als `store.state` zugegriffen und State-Änderungen mit der `store.commit`-Methode ausgeführt werden:

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

Der Grund weshalb eine Mutation committed wird, anstatt `store.state.count` direkt zu verändern, ist die Fähigkeit, die Schritte explizit verfolgen zu können.
Diese simple Konvention ermöglicht unter anderem den Einsatz von Werkzeugen, die jede Mutation protokollieren, State-Snapshots aufnehmen und sogar zeitreisendes Debugging ermöglichen.

Das Nutzen des Store-States in einer Komponente beinhaltet lediglich die Wiedergabe des States in einer **Computed Property** (berechnete Eigenschaft), da der Store-State reaktionsfähig ist. Änderungen auslösen steht hierbei für das committen von Mutations in Komponenten-Methoden.

Hier ist ein Beispiel der [einfachsten Vuex-Counter-App](https://jsfiddle.net/yyx990803/n9jmu5v7/).


Als nächstes werden die Kernkonzepte detaillierter erklärt - beginnent mit [State](state.md).
