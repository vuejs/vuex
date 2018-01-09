import Vue from 'vue';
import { Dispatch, Commit } from './index';

/**
 * Utility types to declare helper types
 */
type Computed<R> = () => R;
type Method<R> = (...args: any[]) => R;
type CustomVue = Vue & Record<string, any>;

interface BaseType { [key: string]: any }

interface BaseStateMap<State, Getters> {
  [key: string]: (this: CustomVue, state: State, getters: Getters) => any;
}

interface BaseMethodMap<F> {
  [key: string]: (this: CustomVue, fn: F, ...args: any[]) => any;
}

type MethodType = 'optional' | 'normal'

/**
 * Return component method type for a mutation.
 * You can specify `Type` to choose whether the argument is optional or not.
 */
type MutationMethod<P, Type extends MethodType> = {
  optional: (payload?: P) => void;
  normal: (payload: P) => void;
}[Type];

/**
 * Return component method type for an action.
 * You can specify `Type` to choose whether the argument is optional or not.
 */
type ActionMethod<P, Type extends MethodType> = {
  optional: (payload?: P) => Promise<any>;
  normal: (payload: P) => Promise<any>;
}[Type];

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
interface MapMutations<Mutations, Type extends MethodType> {
  <Key extends keyof Mutations>(map: Key[]): { [K in Key]: MutationMethod<Mutations[K], Type> };
  <Map extends Record<string, keyof Mutations>>(map: Map): { [K in keyof Map]: MutationMethod<Mutations[Map[K]], Type> };
  <Map extends BaseMethodMap<Commit<Mutations>>>(map: Map): { [K in keyof Map]: Method<any> };
}

interface RootMapMutations<Mutations, Type extends MethodType> extends MapMutations<Mutations, Type> {
  <Key extends keyof Mutations>(namespace: string, map: Key[]): { [K in Key]: MutationMethod<Mutations[K], Type> };
  <Map extends Record<string, keyof Mutations>>(namespace: string, map: Map): { [K in keyof Map]: MutationMethod<Mutations[Map[K]], Type> };
  <Map extends BaseMethodMap<Commit<Mutations>>>(namespace: string, map: Map): { [K in keyof Map]: Method<any> };
}

/**
 * mapActions
 */
interface MapActions<Actions, Type extends MethodType> {
  <Key extends keyof Actions>(map: Key[]): { [K in Key]: ActionMethod<Actions[K], Type> };
  <Map extends Record<string, keyof Actions>>(map: Map): { [K in keyof Map]: ActionMethod<Actions[Map[K]], Type> };
  <Map extends BaseMethodMap<Dispatch<Actions>>>(map: Map): { [K in keyof Map]: Method<any> };
}

interface RootMapActions<Actions, Type extends MethodType> extends MapActions<Actions, Type> {
  <Key extends keyof Actions>(namespace: string, map: Key[]): { [K in Key]: ActionMethod<Actions[K], Type> };
  <Map extends Record<string, keyof Actions>>(namespace: string, map: Map): { [K in keyof Map]: ActionMethod<Actions[Map[K]], Type> };
  <Map extends BaseMethodMap<Dispatch<Actions>>>(namespace: string, map: Map): { [K in keyof Map]: Method<any> };
}

/**
 * namespaced helpers
 */
interface NamespacedMappers<State, Getters, Mutations, Actions, Type extends MethodType> {
  mapState: MapState<State, Getters>;
  mapGetters: MapGetters<Getters>;
  mapMutations: MapMutations<Mutations, Type>;
  mapActions: MapActions<Actions, Type>;
}

export declare const mapState: RootMapState<BaseType, BaseType>;

export declare const mapMutations: RootMapMutations<BaseType, 'optional'>;

export declare const mapGetters: RootMapGetters<BaseType>;

export declare const mapActions: RootMapActions<BaseType, 'optional'>;

export declare function createNamespacedHelpers(namespace?: string): NamespacedMappers<BaseType, BaseType, BaseType, BaseType, 'optional'>;
export declare function createNamespacedHelpers<State, Getters, Mutations, Actions>(namespace?: string): NamespacedMappers<State, Getters, Mutations, Actions, 'normal'>;
