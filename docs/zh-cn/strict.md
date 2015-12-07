# Strict Mode

# 严格模式

To enable strict mode, simply pass in `strict: true` when creating the Vuex instance:

要开启严格模式，只需要在创建 Vuex 实例时传入 `strict: true`:

``` js
const vuex = new Vuex({
  // ...
  strict: true
})
```

In strict mode, whenever Vuex state is mutated outside of mutation handlers, an error will be thrown. This ensures that all state mutations can be explicitly tracked by debugging tools.

在严格模式中，每当 Vuex state 在 mutation handlers 外部被改变时都会抛出错误，以确保所有 state mutations 都可以清晰地被 debugging 工具跟踪。

### Development vs. Production

### 开发环境 vs. 生产环境

**Do not enable strict mode when deploying for production!** Strict mode runs a deep watch on the state tree for detecting inappropriate mutations - make sure to turn it off in production to avoid the performance cost.

**不要在生产环境中开启严格模式！** 为检测使用有问题的 mutations, 严格模式会对 state 树进行深入的监测。所以为了避免不必要的性能损耗，请在生产环境中关闭严格模式。

Similar to middlewares, we can let the build tools handle that:

和中间件一样，我们可以借助 build tool 来做这件事情：

``` js
const vuex = new Vuex({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
