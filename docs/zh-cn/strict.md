# 严格模式

要开启严格模式，只需在创建 Vuex store 是简单地传入 `strict: true`。

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

在严格模式下，只要 Vuex 状态在 mutation 处理器以外被修改就会抛出错误。这确保了所有状态修改都会明确的被调试工具跟踪。

### 开发阶段 vs. 发布阶段

**不要在发布阶段开启严格模式！** 严格模式会对状态树进行深度监测来检测不合适的修改 —— 确保在发布阶段关闭它避免性能损耗。

跟处理插件的情况类似，我们可以让构建工具来处理：

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
