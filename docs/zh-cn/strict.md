# 严格模式

要开启严格模式，只需要在创建 Vuex store 实例时传入 `strict: true`:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

在严格模式中，每当 Vuex state 在 mutation handlers 外部被改变时都会抛出错误。这样我们可以确保所有对状态的改变都可以清晰地被 debugging 工具所记录。

### 开发环境 vs. 生产环境

**不要在生产环境中开启严格模式！** 为了检测在不合适的地方发生的状态修改, 严格模式会对 state 树进行一个深观察 (deep watch)。所以为了避免不必要的性能损耗，请在生产环境中关闭严格模式。

和配置带快照的中间件一样，我们可以通过配置构建工具来将其自动化：

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
