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
  <Key extends keyof Getters>(map: Key[]): { [K in Key]: Computed<Getters[K]> };
  <Map extends Record<string, keyof Getters>>(map: Map): { [K in keyof Map]: Computed<Getters[Map[K]]> };
}

interface RootMapGetters<Getters> extends MapGetters<Getters> {
  <Key extends keyof Getters>(namespace: string, map: Key[]): { [K in Key]: Computed<Getters[K]> };
  <Map extends Record<string, keyof Getters>>(namespace: string, map: Map): { [K in keyof Map]: Computed<Getters[Map[K]]> };
}

interface MapState<State, Getters> {
  <Key extends keyof State>(map: Key[]): { [K in Key]: Computed<State[K]> };
  <Map extends Record<string, keyof State>>(map: Map): { [K in keyof Map]: Computed<State[Map[K]]> };
  <T extends BaseStateMap<State, Getters>>(map: T): { [K in keyof T]: Computed<any> };
}

interface RootMapState<State, Getters> extends MapState<State, Getters> {
  <Key extends keyof State>(namespace: string, map: Key[]): { [K in Key]: Computed<State[K]> };
  <Map extends Record<string, keyof State>>(namespace: string, map: Map): { [K in keyof Map]: Computed<State[Map[K]]> };
  <T extends BaseStateMap<State, Getters>>(namespace: string, map: T): { [K in keyof T]: Computed<any> };
}

interface MapMutations<Mutations> {
  <Key extends keyof Mutations>(map: Key[]): { [K in Key]: MutationMethod<Mutations[K]> };
  <Map extends Record<string, keyof Mutations>>(map: Map): { [K in keyof Map]: MutationMethod<Mutations[Map[K]]> };
  <T extends BaseMethodMap<Commit<Mutations>>>(map: T): { [K in keyof T]: Method<any> };
}

interface RootMapMutations<Mutations> extends MapMutations<Mutations> {
  <Key extends keyof Mutations>(namespace: string, map: Key[]): { [K in Key]: MutationMethod<Mutations[K]> };
  <Map extends Record<string, keyof Mutations>>(namespace: string, map: Map): { [K in keyof Map]: MutationMethod<Mutations[Map[K]]> };
  <T extends BaseMethodMap<Commit<Mutations>>>(namespace: string, map: T): { [K in keyof T]: Method<any> };
}

interface MapActions<Actions> {
  <Key extends keyof Actions>(map: Key[]): { [K in Key]: ActionMethod<Actions[K]> };
  <Map extends Record<string, keyof Actions>>(map: Map): { [K in keyof Map]: ActionMethod<Actions[Map[K]]> };
  <T extends BaseMethodMap<Dispatch<Actions>>>(map: T): { [K in keyof T]: Method<any> };
}

interface RootMapActions<Actions> extends MapActions<Actions> {
  <Key extends keyof Actions>(namespace: string, map: Key[]): { [K in Key]: ActionMethod<Actions[K]> };
  <Map extends Record<string, keyof Actions>>(namespace: string, map: Map): { [K in keyof Map]: ActionMethod<Actions[Map[K]]> };
  <T extends BaseMethodMap<Dispatch<Actions>>>(namespace: string, map: T): { [K in keyof T]: Method<any> };
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
