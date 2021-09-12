# Vuex Strong Types

## Usage
The core idea for this set of types can be simply described as `type first`. You should start designing your store from contract, and your store should implement this contract - not the other way around. As from this package point of view the store is just a vuex module with extra stuff, and I will use word `store` to refer to both store and module.

For example, simple counter store could be described as follows:

```typescript
type CounterState = { value: number }
enum CounterMutations { Increment = "increment", Decrement = "decrement" }

type CounterMutationsTree = {
  [CounterMutations.Increment]: VuexMutationHandler<CounterState, number>, // number is payload
  [CounterMutations.Decrement]: VuexMutationHandler<CounterState, number>,
}

// or you could write it like below, both syntaxes are equally valid
type CounterMutationsTree = {
  [CounterMutations.Increment](state: CounterState, payload: number): void,
  [CounterMutations.Decrement](state: CounterState, payload: number): void,
}

type CounterModule = VuexGlobalModule<CounterState, CounterMutationsTree>
// or
type CounterModule = {
  state: CounterState,
  mutations: CounterMutationsTree
}

export const counter: CounterModule = { 
  ... // will enforce proper types
}
```

### Modules - `VuexModule`
Modules are arguably the most important aspect of vuex, the store itself can be thought of as main module with some extra configurations - and this is in fact how store definition is typed by this project

```typescript
export type VuexModule<
  TState extends {},
  TMutations extends VuexMutationsTree,
  TActions extends VuexActionsTree,
  TGetters extends VuexGettersTree,
  TModules extends VuexModulesTree
> = GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>
  | NamespacedVuexModule<TState, TMutations, TActions, TGetters, TModules>
```

Namespaced modules differs in behavior from non-namespaced (global) modules - therefore there are in fact two different types: `GlobalVuexModule` and `NamespacedVuexModule`.

```typescript
export type NamespacedVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>,
  TActions extends VuexActionsTree<NamespacedVuexModule<TState, TMutations, TActions, TGetters, TModules>> = {} | undefined,
  TGetters extends VuexGettersTree = {} | undefined,
  TModules extends VuexModulesTree = {} | undefined,
> = BaseVuexModule<TState, TMutations, TActions, TGetters, TModules> 
  & { namespaced: true } // Namespaced modules require to have namespaced option set to true

export type GlobalVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>,
  TActions extends VuexActionsTree<GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>> = {} | undefined,
  TGetters extends VuexGettersTree = {} | undefined,
  TModules extends VuexModulesTree = {} | undefined,
> = BaseVuexModule<TState, TMutations, TActions, TGetters, TModules> 
  & { namespaced?: false } // Global modules can either have no namespaced property or have it set as false
```

We can use both types to properly define required module contract

```typescript
type FooModule = NamespacedVuexModule<FooState, FooMutationsTree, FooActionsTree, FooGettersTree, { sub: BazModule }>

// only used properties need to be set, others can be safely set to undefined
type BarModule = GlobalVuexModule<BarState, BarMutationsTree>
type FizzModule = GlobalVuexModule<FizzState, FizzMutationsTree, undefined, FizzGettersTree>

// you can also use plain "object" type syntax if you prefer
// this will work but won't tell you immediately that your contract is incompatible
type BarModule = {
  state: VuexStateProvider<BarState>,
  mutations: BarMutationsTree
}

// now you can just implement your contract, and typescript will aid you
const foo: FooModule = { /* ... */ }
```

Modules can have sub-modules, that are described by the `VuexModulesTree` - basically every module can be sub-module of any other module as long as it does not create circular reference.
```typescript
export type VuexModulesTree 
  = { [name: string]: VuexModule }
```

All properties like mutations, actions and getters will be correctly namespaced based on the sub-module kind.

### State
State is the most straightforward aspect of module - it just represents data held in the store and basically can be any of type. 

#### Full state
However, full state also includes state of the modules, full state of the module can be obtained using `VuexState<TModule>`

```typescript
type SubModule  = NamespacedVuexModule<{ inner: number }, /* ... */>
type RootModule = {
  state: VuexStateProvider<{ root: string }>,
  /* ... */,
  modules: {
    sub:
  }
}

VuexState<RootModule> == { 
  root: string,
  sub: {
    inner: number
  }
}
```

#### State provider
State can be provider by value or by factory, therefore we require to type that accordingly. To simplify things,`VuexStateProvider<TState>` helper can be utilized:
```typescript
export type VuexStateProvider<TState>
  = TState
  | (() => TState)
```

To extract state from the provider, `VuexExtractState<TProvider>` can be used:
```typescript
VuexExtractState<VuexStateProvider<FooState>> == FooState
```

### Mutations
Of course the state have to change somehow - that's what mutations do. All mutations available in given module are described by the `VuexMutationsTree` type. Mutation tree is just an keyed storage for mutation handlers described by `VuexMutationHandler`:

```typescript
export type VuexMutationsTree<TState = any, TDefinition extends VuexStoreDefinition = any>
  = { [name: string]: VuexMutationHandler<TState, any, TDefinition>; }

export type VuexMutationHandler<
  TState, 
  TPayload = never, 
  TDefinition extends VuexStoreDefinition = any,
>
```

Example of mutation tree definition:
```typescript
type FooMutations = {
  added: VuexMutation<FooState, string>,
  removed: VuexMutation<FooState, number>,
}
// or
type FooMutations = {
  added(state: FooState, payload: string): void;
  removed(state: FooState, payload: number): void;
}
```

If mutation requires access to the whole store, it can be typed using third generic argument of `VuexMutationHandler`:
```typescript
VuexMutation<FooState, string, StoreDefinition>
// or
(this: VuexStore<StoreDefinition>, state: FooState, payload: string): void;
```

Be careful when using this construct though, it is circular reference and can create infinite recursion in typescript if not used with caution.


[It is common](https://next.vuex.vuejs.org/guide/mutations.html#using-constants-for-mutation-types) (and in my opinion recommended) for mutation types to be defined as code constants - and in typescript it's possible to use `enums` for that purpose:

```typescript
enum FooMutations {
  Added = "added",
  Removed = "removed",
}
```

Then values of this enum can be used to key mutations tree type:
```typescript
type FooMutationTree = {
  [FooMutations.Added]: VuexMutationHandler<FooState, string>
  [FooMutations.Removed]: VuexMutationHandler<FooState, number>
}
```

Implementation of mutations can be done simply by implementing the tree:
```typescript
// should ensure that everything is typed correctly
const mutations: FooMutationTree = { /* ... */ }
```

Such well-defined mutations are then available from `commit` method of the store:

```typescript
type MyStore = {
  state: { /* ... */ },
  modules: {
    foo: FooModule
  }
}

let store = createStore<MyStore>(/* ... */)

// should check types and provide code assistance
store.commit("foo/added", "test");
store.commit({ type: "foo/added", payload: "test" });
```

There also exists few utility types:
 - `VuexMutationTypes<TModule>` - defines all possible mutation types, e.g. `VuexMutationTypes<MyStore> = "foo/added" | "foo/removed" | /* ... */`
 - `VuexMutations<TModule>` - defines all possible mutations with payloads, e.g. `VuexMutations<MyStore> = { type: "foo/added", payload: string } | { type: foo/removed", payload: number } | /* ... */`
 - `VuexMutationPayload<TModule, TMutation>` - extracts mutation payload by name, e.g. `VuexMutationPayload<MyStore, "foo/added"> = string`

### Actions
In principle, actions are very similar to mutations - the main difference is that they can be asynchronous and have return types. Actions make changes in the state by committing mutations, they can also dispatch another actions if needed. Oh, and in case of namespaced modules they are scoped to module.

Action tree is described by the `VuexActionsTree` type, which itself (same as mutations tree case) is just an collection of action handles:

```typescript
export type VuexActionsTree<
  TModule extends VuexModule = any, 
  TDefinition extends VuexStoreDefinition = any
> = { [name: string]: VuexActionHandler<TModule, any, any, TDefinition>; }

export type VuexActionHandler<
  TModule extends VuexModule, 
  TPayload = never, 
  TResult = Promise<void>,
  TDefinition extends VuexStoreDefinition = any,
>
```

Because actions can access basically everything from the module itself they need to have module back referenced - this can be a little bit tricky sometimes and can cause infinite recursion if not used with caution. However it should be fine in most cases.

Let's reiterate on the `FooModule` example to better see how actions can be defined:
```typescript
enum FooMutations {
  Added = "added",
  Removed = "removed",
}

enum FooActions {
  Refresh = "refresh",
  Load = "load",
}

type FooState = { list: string[] }

type FooMutationTree = {
  [FooMutations.Added]: VuexMutationHandler<FooState, string, MyStore>
  [FooMutations.Removed]: VuexMutationHandler<FooState, number, MyStore>
}

type FooActionsTree = {
  // FooActions.Refresh is scoped to FooModule, does not need any payload, returns Promise<void> and is part of MyStore compatible store
  [FooActions.Refresh]: VuexActionHandler<FooModule, never, Promise<void>, MyStore>,
  // FooActions.Load is scoped to FooModule, does require array of strings as payload, returns Promise<string[]> and is part of MyStore compatible store
  [FooActions.Load]: VuexActionHandler<FooModule, string[], Promise<string[]>, MyStore>,
}

type FooModule = NamespacedVuexModule<FooState, FooMutationTree, FooActionsTree>
```

Of course just like in mutations it is possible to use alternative function based syntax for handler definition - you will however need to make it compatible with requirements by yourself. Enums are also not required but I will stick with them in the rest of examples as I personally think that this is the most correct way.

And again, just like mutations implementation can be done simply by implementing created action tree type:
```typescript
const actions: FooActionsTree = { /* ... */ }
```

Context (defined by `VuexActionContext<TModule, TRoot>` type) that is passed to action handler should be typed correctly and scoped to passed module:

```typescript
const actions: FooActionsTree = {
  async load(context, payload): Promise<string[]> {
    // context is bound to this module
    // and payload is properly typed!
    context.commit(FooMutations.Added, payload[0]);

    // also works for actions
    context.dispatch(FooActions.Load, payload);
    context.dispatch(FooActions.Refresh);

    const list = context.state.list;

    // we can however access root state
    const bar = context.rootState.bar; // typeof bar = BarState;

    // ... and getters
    const first = context.rootGetters['anotherFoo/first'];

    return [];
  },
  async refresh(context) {
    // simple actions to not require return type!
  }
}
```

Again there also exists few utility types:
 - `VuexActionTypes<TModule>` - defines all possible action types, e.g. `VuexActionTypes<MyStore> = "foo/load" | "foo/refresh" | /* ... */`
 - `VuexActions<TModule>` - defines all possible actions with payloads, e.g. `VuexActions<MyStore> = { type: "foo/load", payload: string[] } | { type: "foo/refresh" } | /* ... */`
 - `VuexActionPayload<TModule, TAction>` - extracts action payload by name, e.g. `VuexMutationPayload<MyStore, "foo/load"> = string[]`
 - `VuexActionResult<TModule, TAction>` - extracts action result by name, e.g. `VuexMutationPayload<MyStore, "foo/load"> = Promise<string[]>`

### Getters
Getters are, to put simply, just computer properties of state accessible by some key. Getters tree is described by the `VuexGettersTree` type, which itself is just an collection of getters:

```typescript
export type VuexGettersTree<TModule extends VuexModule = any>
  = { [name: string]: VuexGetter<TModule, any, any, any>; }

export type VuexGetter<
  TModule extends VuexModule, 
  TResult, 
  TRoot extends VuexModule = any,
  TGetters = VuexGetters<TModule>
> 
```

Definition and implementation of getter tree is simple:
```typescript
type FooGettersTree = {
  first: VuexGetter<FooModule, string>
  firstCapitalized: VuexGetter<FooModule, string>,
  rooted: VuexGetter<FooModule, string, MyStore>, // allows referencing root module
}

const getters: FooGettersTree = {
  first: state => state.list[0], // state is correctly typed
  firstCapitalized: (_, getters) => getters.first.toUpperCase(), // getters too!
  rooted: (state, getters, rootState, rootGetters) => rootState.global + rootGetters.globalGetter, // and global state!
}
```

And getters can be then accessed from the store, and the result will have correct type:
```typescript
store.getters['foo/first'] // string
```

As always there exists few utility types:
 - `VuexGetterNames<TModule>` - defines all possible getter names, e.g. `VuexGetterNames<MyStore> = "foo/first" | "foo/firstCapitalized" | /* ... */`
 - `VuexGetters<TModule>` - defines all possible getters with results, e.g. `VuexGetters<MyStore> = { first: string, firstCapitalized: string }`

### Store
As was previously said, the store definition is just a global module with extra properties:
```typescript
export type VuexStoreDefinition<
  TState extends {} = {},
  TMutations extends VuexMutationsTree = VuexMutationsTree,
  TActions extends VuexActionsTree = VuexActionsTree,
  TGetters extends VuexGettersTree = VuexGettersTree,
  TModules extends VuexModulesTree = VuexModulesTree,
> = Omit<GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>, "namespaced">
  & {
    strict?: boolean,
    devtools?: boolean,
    plugins?: VuexPlugin<VuexStoreDefinition<TState, TMutations, TActions, TGetters, TModules>>[]
  }
```

The `createStore` function takes `VuexStoreDefinition` as an argument, and creates store instance from it. The store instance is described by the `VuexStore<TDefinition extends VuexStoreDefinition>` type. 

Store instance should be fully typed and be mostly type-safe. It means that payloads of actions and mutations would be checked, action results will be known and could be checked, values from getters will be properly typed and so on. You also won't be able to commit/dispatch non-existent mutations/actions.

```typescript
type MyStore = {
  state: {
    global: string;
  },
  modules: {
    foo: FooModule,
    bar: BarModule,
    anotherFoo: FooModule,
  },
}

// test
let store = createStore<MyStore>({ /* ... */ })

// should check and auto complete
store.commit("foo/added", "test");
store.commit({ type: "foo/added", payload: "test" });

// @ts-expect-error
store.commit("foo/added", 9);
// @ts-expect-error
store.commit("foo/added");

// dispatch works too!
store.dispatch("anotherFoo/load", ["test"]);
store.dispatch({ type: "anotherFoo/load", payload: ["test"] });

// @ts-expect-error
store.dispatch("anotherFoo/load", 0);
// @ts-expect-error
store.dispatch("foo/load");

// should check correctly
store.replaceState({
  global: "test",
  foo: {
    list: [],
    sub: {
      current: 0
    }
  },
  anotherFoo: {
    list: [],
    sub: {
      current: 0
    }
  },
  bar: {
    result: "fizzbuzz"
  }
})

// getters also work
store.getters['anotherFoo/first'];

// watch state is properly typed
store.watch(state => state.global, (value, oldValue) => value.toLowerCase() !== oldValue.toLowerCase())

// watch getters too!
store.watch((_, getters) => getters['foo/first'], (value, oldValue) => value.toLowerCase() !== oldValue.toLowerCase())

store.subscribe(mutation => {
  // properly detects payload type based on mutaiton kind
  if (mutation.type === "anotherFoo/sub/dec") {
    const number = mutation.payload; // typeof number = number
  } else if (mutation.type === "anotherFoo/added") {
    const str = mutation.payload; // typeof str = string
  }
})

store.subscribeAction((action, state) => {
  // properly detects payload type based on action kind
  if (action.type === "anotherFoo/load") {
    const arr = action.payload; // typeof arr = string[]
  }

  // state is also correctly represented
  const foo = state.foo.list;
})

// object notation is also supported
store.subscribeAction({
  after(action, state) { /* ... */ },
  before(action, state) { /* ... */ },
  error(action, state, error) { /* ... */ }
})
```

In theory store definition could be inferred from the argument of `createStore` but it's highly unrecommended as the contract will be basically guessed (which means that it can be guessed wrongly) based on definition and not checked - it should provide some useful features when using store instance though.

```typescript
const store = createStore({
  state: { list: [] },
  mutations: {
    add(state, element: string) {
      // State won't be type-safe as full definition of this store is unknown at this point
      /* ... */ 
    },
    remove(state, index: number) { /* ... */ },
  },
  mutations: {
    clear(context) { 
      // Context won't be type-safe as full definition of this store is unknown at this point
      /* ... */ 
    },
    load(state, ids: string[]) { /* ... */ },
  }
})

// This should however work fine
store.commit('add', 'string')
store.commit('add', []) // should be an error as payload must be a string

// Same thing goes for dispatch
store.dispatch('clear')
store.load('load', ['x', 'y', 'z'])
store.load('load', 0) // should be an error as payload must be an array of strings
```

It is also possible to turn off type safety by explicitly providing `any` type to `createStore`, which could be useful when dealing with highly dynamic stores. 

### Component Binding Helpers
Vuex provides handy [Component Binding Helpers] that can be used for easily mapping state, getters, mutations and actions into component. Those helpers are also strictly typed. Unfortunately, until typescript has proper partial infering support (see issue [#10571](https://github.com/microsoft/TypeScript/issues/10571)) it's not possible to use syntax like `mapState<MyStore>(...)`. By default helpers are bound non-type-safely to any module, and to enable type safety it's required to re-export them with proper type applied. This could be done in the same file as store definition, for example:

```typescript
import { 
  mapState as mapStateLoosely, 
  mapGetters as mapGettersLoosely, 
  mapMutations as mapMutationsLoosely, 
  mapActions as mapActionsLoosely, 
  createNamespacedHelpers as createLooseNamespacedHelpers,
  VuexMapStateHelper,
  VuexMapGettersHelper,
  VuexMapMutationsHelper,
  VuexMapActionsHelper, 
  VuexCreateNamespacedHelpers
} from "vuex";

type MyStore = { ... }

// as any step is required so typescript does not try to check type 
// compatibility, which can cause infinite loop in compiler
export const mapState = mapStateLoosely as any as VuexMapStateHelper<MyStore>;
export const mapGetters = mapGettersLoosely as any as VuexMapGettersHelper<MyStore>;
export const mapMutations = mapMutationsLoosely as any as VuexMapMutationsHelper<MyStore>;
export const mapActions = mapActionsLoosely as any as VuexMapActionsHelper<MyStore>;
export const createNamespacedHelpers = createLooseNamespacedHelpers as any as VuexCreateNamespacedHelpers<MyStore>;
```

Then you should be able to import those wrappers with typing applied and use type-safe helpers.

## Gotchas and caveats
1. This types are quite complex, errors can be overwhelming and hard to understand.
2. This types _are complex_ and occasionally you can face some bugs in the compiler that will cause it to stop responding and loop infinitely.

## Full Example
This example is taken from the [tests/basic.ts](./tests/basic.ts) file and could be interactively tested using vscode or other editor with decent support of typescript language server.

```typescript
// example store definition
type FooState = { list: string[] }
type BarState = { result: string }
type BazState = { current: number }

enum FooMutations {
  Added = "added",
  Removed = "removed",
}

enum FooActions {
  Refresh = "refresh",
  Load = "load",
}

enum BarMutations {
  Fizz = "fizz",
  Buzz = "buzz",
}

enum BazMutations {
  Inc = "inc",
  Dec = "dec",
}

type FooMutationTree = {
  [FooMutations.Added]: VuexMutationHandler<FooState, string>
  [FooMutations.Removed]: VuexMutationHandler<FooState, number>
}

type FooActionsTree = {
  [FooActions.Refresh]: VuexActionHandler<FooModule, never, Promise<void>, MyStore>,
  [FooActions.Load]: VuexActionHandler<FooModule, string[], Promise<string[]>, MyStore>,
}

type FooGettersTree = {
  first: VuexGetter<FooModule, string>,
  firstCapitalized: VuexGetter<FooModule, string>,
  rooted: VuexGetter<FooModule, string, MyStore>,
}

type BarMutationTree = {
  [BarMutations.Fizz]: VuexMutationHandler<BarState, number>;
  [BarMutations.Buzz]: VuexMutationHandler<BarState>;
}

type BazMutationTree = {
  [BazMutations.Inc]: VuexMutationHandler<BazState, number>;
  [BazMutations.Dec]: VuexMutationHandler<BazState, number>;
}

type FooModule = NamespacedVuexModule<FooState, FooMutationTree, FooActionsTree, FooGettersTree, { sub: BazModule }>;
type BarModule = GlobalVuexModule<BarState, BarMutationTree>;
type BazModule = NamespacedVuexModule<BazState, BazMutationTree>;

type MyStore = {
  state: {
    global: string;
  },
  modules: {
    foo: FooModule,
    bar: BarModule,
    anotherFoo: FooModule,
  },
  mutations: {},
  getters: {},
  actions: {},
}

let store = createStore<MyStore>({} as any)

// should check and auto complete
store.commit("foo/added", "test");
store.commit({ type: "foo/added", payload: "test" });

// dispatch works too!
store.dispatch("anotherFoo/load", ["test"]);
store.dispatch({ type: "anotherFoo/load", payload: ["test"] });

// should check correctly
store.replaceState({
  global: "test",
  foo: {
    list: [],
    sub: {
      current: 0
    }
  },
  anotherFoo: {
    list: [],
    sub: {
      current: 0
    }
  },
  bar: {
    result: "fizzbuzz"
  }
})

// getters also work
store.getters['anotherFoo/first'];

// watch state is properly typed
store.watch(state => state.global, (value, oldValue) => value.toLowerCase() !== oldValue.toLowerCase())

// watch getters too!
store.watch((_, getters) => getters['foo/first'], (value, oldValue) => value.toLowerCase() !== oldValue.toLowerCase())

store.subscribe(mutation => {
  // properly detects payload type based on mutaiton kind
  if (mutation.type === "anotherFoo/sub/dec") {
    const number = mutation.payload; // typeof number = number
  } else if (mutation.type === "anotherFoo/added") {
    const str = mutation.payload; // typeof str = string
  }
})

store.subscribeAction((action, state) => {
  // properly detects payload type based on action kind
  if (action.type === "anotherFoo/load") {
    const arr = action.payload; // typeof arr = string[]
  }

  // state is also correctly represented
  const foo = state.foo.list;
})

// 
store.subscribeAction({
  after(action, state) { /* ... */ },
  before(action, state) { /* ... */ },
  error(action, state, error) { /* ... */ }
})

// getters with backreference
let fooGetters: FooGettersTree = {
  first: state => state.list[0], // state is correctly typed
  firstCapitalized: (_, getters) => getters.first.toUpperCase(), // getters too!
  rooted: (_, __, rootState, rootGetters) => rootState.global + rootGetters.globalGetter, // and global state!
}

let fooActions: FooActionsTree = {
  async load(context, payload): Promise<string[]> {
    // context is bound to this module
    // and payload is properly typed!
    context.commit(FooMutations.Added, payload[0]);

    context.dispatch(FooActions.Load, payload);
    context.dispatch(FooActions.Refresh);

    const list = context.state.list;

    // we can however access root state
    const bar = context.rootState.bar; // typeof bar = BarState;

    // ... and getters
    const first = context.rootGetters['anotherFoo/first'];

    return [];
  },
  async refresh(context) {
    // simple actions do not require return type!
  }
}

// utility types
type PayloadOfFooAddedMutation = VuexMutationPayload<MyStore, "foo/added">; // string

type PayloadOfFooLoadAction = VuexActionPayload<MyStore, "foo/load">; // string[]
type ResultOfFooLoadAction = VuexActionResult<MyStore, "foo/load">; // string[]
```

## Progress
 - [x] Modules 
   - [x] Global `VuexGlobalModule<TState, TMutations = {}, TActions = {}, TModules = {}, TGetters = {}>`
   - [x] Namespaced `VuexNamespacedModule<TState, TMutations = {}, TActions = {}, TModules = {}, TGetters = {}>`
   - [x] State `TState`
     - [x] State helper `VuexState<TModule>`
       - [x] Own `VuexOwnState<TModule>`
       - [x] From submodules
   - [x] Mutations `TMutations extends VuexMutationsTree`
     - [x] Non-type-safe fallback `VuexMutationsTree` ??
     - [x] Available mutations `VuexMutations<TModule>`
       - [x] Own `VuexOwnMutations<TModule>`
       - [x] From submodules
         - [x] Global 
         - [x] Namespaced
     - [x] Mutation handler type `VuexMutationHandler<TState, TPayload = never, TStore = never>`
       - [x] Properly type `this` in handler (store backref)
     - [x] Commit types
       - [x] Payload `VuexMutationPayload<TModule, TMutation>`
       - [x] Argument-Style `VuexCommit<TModule>`
       - [x] Object-Style `VuexMutations<TModule>`
       - [x] Commit options `VuexCommitOptions`
         - [ ] Support `{ root: true }`
   - [x] Actions `TActions extends VuexActionsTree`
     - [x] Non-type-safe fallback `VuexActionsTree` ??
     - [x] Available actions `VuexActions<TModule>`
       - [x] Own `VuexOwnActions<TModule>`
       - [x] From submodules
         - [x] Global 
         - [x] Namespaced
     - [x] Action handler `VuexActionHandler<TModule, TPayload = never, TResult = Promise<void>>`
       - [x] Action Context `VuexActionContext<TModule, TStoreDefinition = any>` 
       - [x] Properly type `this` in handler (store backref)
     - [x] Dispatch type `VuexDispatch<TModule>`
       - [x] Payload `VuexActionPayload<TModule, TAction>`
       - [x] Result `VuexActionResult<TModule, TAction>`
       - [x] Argument-Style
       - [x] Object-Style `VuexAction<TModule>`
       - [x] Dispatch Options `VuexDispatchOptions`
         - [ ] Support `{ root: true }`
   - [x] Getters `TGetters extends VuexGettersTree`
     - [x] Non-type-safe fallback `VuexGettersTree` ??
     - [x] Available getters `VuexGetters<TModule>`
       - [x] Own `VuexOwnGetters<TModule>`
       - [x] From submodules
         - [x] Global 
         - [x] Namespaced
     - [x] Getter type `VuexGetter<TModule, TResult>`
       - [x] Support for beckreferencing getters
     - [x] Result `VuexGetterResult<TModule, TGetter>`
   - [x] Submodules `TModules extends VuexModulesTree`
 - [x] Store Definition `VuexStoreDefinition<TState, TMutations = {}, TActions = {}, TModules = {}, TGetters = {}>`
   - Basically `VuexGlobalModule` with additional things
   - [x] Plugins `VuexPlugin<TStoreDefinition>`
   - [x] Simple properties (`devtools`, etc.)
 - [x] Store instance `VuexStore<TStoreDefinition>`
   - [x] Constructor
     - [x] Store Options `VuexStoreDefinition`
   - [x] State (as defined by TStoreDefinition)
     - [x] Replace state `replaceState` 
   - [x] Getters (as defined by TStoreDefinition)
   - [x] Commit (as defined by TStoreDefinition)
   - [x] Dispatch (as defined by TStoreDefinition)
   - [x] Subscribers
     - [x] Options `VuexSubscribeOptions` 
     - [x] Actions `subscribeAction`
       - [x] Subscriber `VuexActionSubscriber<TDefinition>`
         - [x] Callback `VuexActionSubscriberCallback<TDefinition>`
         - [x] ErrorCallback `VuexActionErrorSubscriberCallback<TDefinition>`
         - [x] Object `VuexActionSubscribersObject<TDefinition>`
     - [x] Mutations `subscribe`
       - [x] Subscriber `VuexMutationSubscriber<TDefinition>`
   - [x] Watch `watch`
     - [x] ~~Options `WatchOptions`~~ should be imported from Vue
   - [x] Dynamic module management
     - [x] Registration `registerModule`
     - [x] Unregistration `unregisterModule`
     - [x] Presence check `hasModule`
   - [x] Hot Update - it's not type safe so it's declared loosely
   - [ ] Composition api helpers
     - [ ] `useStore<TKey extends VuexInjectionKey<TStore>, TStore>(key: TKey): VuexStore<TStore>`
   - [x] Helpers
     - [x] `mapState<TModule>` in form of `VuexMapStateHelper<TModule>`
     - [x] `mapMutations<TModule>` in form of `VuexMapMutationsHelper<TModule>`
     - [x] `mapGetters<TModule>` in form of `VuexMapGettersHelper<TModule>`
     - [x] `mapActions<TModule>` in form of `VuexMapActionsHelper<TModule>`
     - [x] `createNamespaceHelpers<TModule>` in form of `VuexCreateNamespacedHelpers<TModule>`

[template literal types]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types
[vuex types]: https://github.com/vuejs/vuex/blob/4.0/types/index.d.ts
[Component Binding Helpers]: https://next.vuex.vuejs.org/api/#component-binding-helpers