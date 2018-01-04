import Vue from 'vue';
import { Dispatch, Commit } from './index';

type Computed<R> = () => R;
type Method<R> = (...args: any[]) => R;
type MutationMethod<P> = (payload: P) => void;
type ActionMethod<P> = (payload: P) => Promise<any>;
type CustomVue = Vue & Record<string, any>;

interface BaseStateMap<State, Getters> {
  [key: string]: (this: CustomVue, state: State, getters: Getters) => any;
}

interface BaseType { [key: string]: any }

interface BaseMethodMap<F> {
  [key: string]: (this: CustomVue, fn: F, ...args: any[]) => any;
}

interface MapGetters<Getters> {
  <G extends Getters = Getters, Key extends keyof G = keyof G>(map: Key[]): { [K in Key]: Computed<G[K]> };
  <G extends Getters = Getters, Map extends Record<string, keyof G> = Record<string, keyof G>>(map: Map): { [K in keyof Map]: Computed<G[Map[K]]> };
}

interface RootMapGetters<Getters> extends MapGetters<Getters> {
  <G extends Getters = Getters, Key extends keyof G = keyof G>(namespace: string, map: Key[]): { [K in Key]: Computed<G[K]> };
  <G extends Getters = Getters, Map extends Record<string, keyof G> = Record<string, keyof G>>(namespace: string, map: Map): { [K in keyof Map]: Computed<G[Map[K]]> };
}

interface MapState<State, Getters> {
  <S extends State = State, Key extends keyof S = keyof S>(map: Key[]): { [K in Key]: Computed<S[K]> };
  <S extends State = State, Map extends Record<string, keyof S> = Record<string, keyof S>>(map: Map): { [K in keyof Map]: Computed<S[Map[K]]> };
  <S extends State = State, G extends Getters = Getters, Map extends BaseStateMap<S, G> = BaseStateMap<S, G>>(map: Map): { [K in keyof Map]: Computed<any> };
}

interface RootMapState<State, Getters> extends MapState<State, Getters> {
  <S extends State = State, Key extends keyof S = keyof S>(namespace: string, map: Key[]): { [K in Key]: Computed<S[K]> };
  <S extends State = State, Map extends Record<string, keyof S> = Record<string, keyof S>>(namespace: string, map: Map): { [K in keyof Map]: Computed<S[Map[K]]> };
  <S extends State = State, G extends Getters = Getters, Map extends BaseStateMap<S, G> = BaseStateMap<S, G>>(namespace: string, map: Map): { [K in keyof Map]: Computed<any> };
}

interface MapMutations<Mutations> {
  <M extends Mutations = Mutations, Key extends keyof M = keyof M>(map: Key[]): { [K in Key]: MutationMethod<M[K]> };
  <M extends Mutations = Mutations, Map extends Record<string, keyof M> = Record<string, keyof M>>(map: Map): { [K in keyof Map]: MutationMethod<M[Map[K]]> };
  <M extends Mutations = Mutations, Map extends BaseMethodMap<Commit<M>> = BaseMethodMap<Commit<M>>>(map: Map): { [K in keyof Map]: Method<any> };
}

interface RootMapMutations<Mutations> extends MapMutations<Mutations> {
  <M extends Mutations = Mutations, Key extends keyof M = keyof M>(namespace: string, map: Key[]): { [K in Key]: MutationMethod<M[K]> };
  <M extends Mutations = Mutations, Map extends Record<string, keyof M> = Record<string, keyof M>>(namespace: string, map: Map): { [K in keyof Map]: MutationMethod<M[Map[K]]> };
  <M extends Mutations = Mutations, Map extends BaseMethodMap<Commit<M>> = BaseMethodMap<Commit<M>>>(namespace: string, map: Map): { [K in keyof Map]: Method<any> };
}

interface MapActions<Actions> {
  <A extends Actions = Actions, Key extends keyof A = keyof A>(map: Key[]): { [K in Key]: ActionMethod<A[K]> };
  <A extends Actions = Actions, Map extends Record<string, keyof A> = Record<string, keyof A>>(map: Map): { [K in keyof Map]: ActionMethod<A[Map[K]]> };
  <A extends Actions = Actions, Map extends BaseMethodMap<Dispatch<A>> = BaseMethodMap<Dispatch<A>>>(map: Map): { [K in keyof Map]: Method<any> };
}

interface RootMapActions<Actions> extends MapActions<Actions> {
  <A extends Actions = Actions, Key extends keyof A = keyof A>(namespace: string, map: Key[]): { [K in Key]: ActionMethod<A[K]> };
  <A extends Actions = Actions, Map extends Record<string, keyof A> = Record<string, keyof A>>(namespace: string, map: Map): { [K in keyof Map]: ActionMethod<A[Map[K]]> };
  <A extends Actions = Actions, Map extends BaseMethodMap<Dispatch<A>> = BaseMethodMap<Dispatch<A>>>(namespace: string, map: Map): { [K in keyof Map]: Method<any> };
}

interface NamespacedMappers<State, Getters, Mutations, Actions> {
  mapState: MapState<State, Getters>;
  mapGetters: MapGetters<Getters>;
  mapMutations: MapMutations<Mutations>;
  mapActions: MapActions<Actions>;
}

export declare const mapState: RootMapState<BaseType, BaseType>;

export declare const mapMutations: RootMapMutations<BaseType>;

export declare const mapGetters: RootMapGetters<BaseType>;

export declare const mapActions: RootMapActions<BaseType>;

export declare function createNamespacedHelpers(namespace: string): NamespacedMappers<BaseType, BaseType, BaseType, BaseType>;
export declare function createNamespacedHelpers<State, Getters, Mutations, Actions>(namespace: string): NamespacedMappers<State, Getters, Mutations, Actions>;
