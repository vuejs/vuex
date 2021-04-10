# 严格模式

开启严格模式，仅需在创建 store 的时候传入 `strict: true`：

``` js
const store = createStore({
  // ...
  strict: true
})
```

在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

### 开发环境与发布环境

**不要在发布环境下启用严格模式**！严格模式会深度监测状态树来检测不合规的状态变更——请确保在发布环境下关闭严格模式，以避免性能损失。

类似于插件，我们可以让构建工具来处理这种情况：

``` js
const store = createStore({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
