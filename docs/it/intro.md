## Che cos'è Vuex?

Vuex è un'archietettura per sviluppare applicazioni in Vue.js avendo un controllo dello stato centralizzato. Ispirato da [Flux](https://facebook.github.io/flux/) e [Redux](https://github.com/rackt/redux), ma con una implementazione di fondo più semplice ed intuitiva per lavorare all'unisono con Vue.js ed il suo sistema reattivo.

## Perchè dovrei aver bisogno di tutto ciò?

Se la vostra applicazione è abbastanza semplice, probabilmente non avete bisogno di un'architettura come Vuex. Non applicate concetti in modo prematuro se non servono. Nel caso stiate costruendo una SPA di medie/grosse dimensioni allora si, l'esigenza di Vuex si fa più viva per gestire i vostri componenti ed il loro stato.

Quando si utilizza Vue.js, tendiamo a conservare lo stato internamente ai nostri componenti. Con questo processo ogni componente avrà un "pezzo di stato", dell'intera applicazione, al suo interno. Quando i componenti iniziano a comunicare tra di loro, essi dovranno anche condividere lo stato attuale che conservano al loro interno, il che può portare ad un incongruenza quando più componenti condividono la stessa informazione sullo stato dell'applicazione. Una pratica molto comune per ovviare a questo problema è implementare un sistema di eventi personalizzati che inviano gli stati ad ogni componente che lo richiede. Questa metodologia però porta a costruire eventi sempre più complessi all aumentare dei componenti e degli stati che si frammentano sempre di più.

Per gestire meglio gli stati in un'applicazione che è in continua crescita bisogna iniziare a differenziare **gli stati locali dei componenti** da **gli stati globali dell'applicazione**. Gli stati dell'applicazione non appartengono a nessun componente, ma tutti i componenti possono averne bisogno (per esempio per monitorare gli aggiornamenti del DOM). Centralizzando gli stati in un unico luogo non abbiamo più bisogno di passare eventi in giro per tutti i componenti. In aggiunta questa centralizzazione ci permette di monitorare meglio qualsiasi mutazione l'applicazione subisce.

Vuex inoltre fornisce degli strumenti per suddividere al meglio la logica degli stati in varie parti ma senza intaccare la flessibilità di avere tutto centralizzato.
