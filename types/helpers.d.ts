import Vue from 'vue';
import { Dispatch, Commit } from './index';

/**
 * Utility types to declare helper types
 */
type Computed<R> = () => R;
type Method<R> = (...args: any[]) => R;
type MutationMethod<P> = (payload: P) => void;
type ActionMethod<P> = (payload: P) => Promise<any>;
type CustomVue = Vue & Record<string, any>;

interface BaseType { [key: string]: any }

interface BaseStateMap<State, Getters> {
  [key: string]: (this: CustomVue, state: State, getters: Getters) => any;
}

interface BaseMethodMap<F> {
  [key: string]: (this: CustomVue, fn: F, ...args: any[]) => any;
}

/**
 * mapGetters
 */
interface MapGetters<Getters> {
  <Key extends keyof Getters>(map: Key[]): { [K in Key]: Computed<Getters[K]> };
  <Map extends Record<string, keyof Getters>>(map: Map): { [K in keyof Map]: Computed<Getters[Map[K]]> };
}

interface RootMapGetters<Getters> extends MapGetters<Getters> {
  <Key extends keyof Getters>(namespace: string, map: Key[]): { [K in Key]: Computed<Getters[K]> };
  <Map extends Record<string, keyof Getters>>(namespace: string, map: Map): { [K in keyof Map]: Computed<Getters[Map[K]]> };
}

/**
 * mapState
 */
interface MapState<State, Getters> {
  <Key extends keyof State>(map: Key[]): { [K in Key]: Computed<State[K]> };
  <Map extends Record<string, keyof State>>(map: Map): { [K in keyof Map]: Computed<State[Map[K]]> };
  <Map extends BaseStateMap<State, Getters>>(map: Map): { [K in keyof Map]: Computed<any> };
}

interface RootMapState<State, Getters> extends MapState<State, Getters> {
  <Key extends keyof State>(namespace: string, map: Key[]): { [K in Key]: Computed<State[K]> };
  <Map extends Record<string, keyof State>>(namespace: string, map: Map): { [K in keyof Map]: Computed<State[Map[K]]> };
  <Map extends BaseStateMap<State, Getters>>(namespace: string, map: Map): { [K in keyof Map]: Computed<any> };
}

/**
 * mapMutations
 */
interface MapMutations<Mutations> {
  <Key extends keyof Mutations>(map: Key[]): { [K in Key]: MutationMethod<Mutations[K]> };
  <Map extends Record<string, keyof Mutations>>(map: Map): { [K in keyof Map]: MutationMethod<Mutations[Map[K]]> };
  <Map extends BaseMethodMap<Commit<Mutations>>>(map: Map): { [K in keyof Map]: Method<any> };
}

interface RootMapMutations<Mutations> extends MapMutations<Mutations> {
  <Key extends keyof Mutations>(namespace: string, map: Key[]): { [K in Key]: MutationMethod<Mutations[K]> };
  <Map extends Record<string, keyof Mutations>>(namespace: string, map: Map): { [K in keyof Map]: MutationMethod<Mutations[Map[K]]> };
  <Map extends BaseMethodMap<Commit<Mutations>>>(namespace: string, map: Map): { [K in keyof Map]: Method<any> };
}

/**
 * mapActions
 */
interface MapActions<Actions> {
  <Key extends keyof Actions>(map: Key[]): { [K in Key]: ActionMethod<Actions[K]> };
  <Map extends Record<string, keyof Actions>>(map: Map): { [K in keyof Map]: ActionMethod<Actions[Map[K]]> };
  <Map extends BaseMethodMap<Dispatch<Actions>>>(map: Map): { [K in keyof Map]: Method<any> };
}

interface RootMapActions<Actions> extends MapActions<Actions> {
  <Key extends keyof Actions>(namespace: string, map: Key[]): { [K in Key]: ActionMethod<Actions[K]> };
  <Map extends Record<string, keyof Actions>>(namespace: string, map: Map): { [K in keyof Map]: ActionMethod<Actions[Map[K]]> };
  <Map extends BaseMethodMap<Dispatch<Actions>>>(namespace: string, map: Map): { [K in keyof Map]: Method<any> };
}

/**
 * namespaced helpers
 */
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

export declare function createNamespacedHelpers(namespace?: string): NamespacedMappers<BaseType, BaseType, BaseType, BaseType>;
export declare function createNamespacedHelpers<State, Getters, Mutations, Actions>(namespace?: string): NamespacedMappers<State, Getters, Mutations, Actions>;
