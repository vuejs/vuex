## What is Vuex?

Vuex is an application architecture for centralized state management in Vue.js applications. It is inspired by [Flux](https://facebook.github.io/flux/) and [Redux](https://github.com/rackt/redux), but with simplified concepts and an implementation that is designed specifically to take advantage of Vue.js' reactivity system.

## Why do I need this?

If your app is simple enough, you probably don't need Vuex. Don't apply it prematurely. But if you are building a medium-to-large-scale SPA, chances are you have run into situations that make you think about how to better structure things outside of your Vue components. This is where Vuex comes into play.

When using Vue.js alone, we often tend to store the state "inside" our components. That is, each component owns a piece of our application state, and as a result the state is scattered all over the place. However, sometimes a piece of state needs to be shared by multiple components. A commonly-seen practice is letting one component "send" some state to other components using the custom event system. However, the event flow inside large component trees can quickly become complex, and it's often difficult to reason about when something goes wrong.

To better deal with shared state in large applications, we need to differentiate between **component local state** and **application level state**. Application state does not belong to a specific component, but our components can still observe it for reactive DOM updates. By centralizing its management in a single place, we no longer need to pass events around, because everything that affects more than one component should belong there. In addition, this allows us to record and inspect every mutation for easier understanding of state changes, and even implement fancy stuff like time-travel debugging.

Vuex also enforces some opinions on how to split state management logic into different places, but still allows enough flexibility for the actual code structure.
