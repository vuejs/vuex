export interface ConstructorOption {
    state?: any;
    mutations?: any;
    middlewares?: {
        snapshot: boolean;
        onInit: Function;
        onMutation: Function;
    }[];
    strict?: boolean;
    modules?: any;
}

export class Store<S> {
    constructor(obj: ConstructorOption);
    state: S;
    dispatch(mutationName: any, ...args: any[]): void;
    watch(pathOrGetter: (string | Function), cb: Function, options: any): void;
}

export function install(...args: any[]): any;
