# 应用架构

Vuex doesn't really restrict how you structure your code. Rather, it enforces a set of high-level principles:
Vuex 没有确切地限制你该如何组织代码结构。有一点点强制实施的，那就是一些高级原则：

1. 应用级的状态徐集中在 store 中。

2. 修改状态的唯一方式就是通过提交 **mutation**，它是同步的事务。

3. 异步逻辑应该封装在 **action** 中，并且可以组合 action。

只要你遵循这些规则，随你怎么设计你的项目结构。如果你的 store 文件非常大，直接开始分割 action、mutation 和 getter 到多个文件。

对于复杂的应用，我们可能需要使用模块化。下面是一个项目结构案例：

``` bash
├── index.html
├── main.js
├── api
│   └── ... # 抽象封装用于发起 API 请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 收集模块 和 export store
    ├── actions.js        # 根 action
    ├── mutations.js      # 根 mutation
    └── modules
        ├── cart.js       # cart 模块
        └── products.js   # products 模块
```

查看 [购物车例子](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart) 作为指南。
