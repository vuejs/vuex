## 什么是 Vuex?

Vuex 是 Vue.js 应用的 state 管理结构。它受启发于 [Flux](https://facebook.github.io/flux/) 和 [Redux](https://github.com/rackt/redux)，但 Vuex 的设计更加符合 Vue.js 的响应系统（reactivity system）。

## 我为什么需要它？

当你的应用还很简单的时候，你可能并不需要 Vuex，也不建议在过早地去用它。相反，如果你正在构建一个规模越来越大的 SPA 时，你会开始考虑如何管理好 Vue 组件之外的东西。这就是 Vuex 要做的事。

我们在用 Vue.js 的时候，通常会把 state 储存在组件的内部。也就是说，每一个组件都拥有自己单独的状态。然而有时候我们需要把一部分的 state 共享给其它组件，通常我们都是使用第三方的事件系统去达到这个目的。这个模式的问题在于，事件流会在逐渐增长的组件树中变得复杂，并且在出现问题的时候很难去发现问题的所在。

为了更好的解决在大型应用中共享 state 的问题，我们需要把组件 state（component local state）和应用级 state（application level state）区分开来。应用级的 state 不属于任何特定的组件，但每一个组件仍然可以观察到 state 变化从而自动更新 DOM。通过把 state 管理逻辑放在同一个地方，我们就不需要在各个地方去处理各种事件，因为任何牵扯到多个组件的东西，都会放在这个地方。这样做也能使记录和检查 state 的改变成为可能，甚至可以做些像 time-travel 这样的调试。

即使 Vuex 对状态管理的分离有一些约束，但不会影响你实际代码结构的灵活性。
