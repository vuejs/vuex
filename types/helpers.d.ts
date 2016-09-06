type Dictionary<T> = { [key: string]: T };

export function mapState (map: string[]): Dictionary<() => any>;
export function mapState (map: Dictionary<string>): Dictionary<() => any>;
export function mapState <S>(
  map: Dictionary<(this: vuejs.Vue, state: S, getters: any) => any>
): Dictionary<() => any>;

type MutationMethod = (...args: any[]) => void;
export function mapMutations (map: string[]): Dictionary<MutationMethod>;
export function mapMutations (map: Dictionary<string>): Dictionary<MutationMethod>;

export function mapGetters (map: string[]): Dictionary<() => any>;
export function mapGetters (map: Dictionary<string>): Dictionary<() => any>;

type ActionMethod = (...args: any[]) => Promise<any[]>;
export function mapActions (map: string[]): Dictionary<ActionMethod>;
export function mapActions (map: Dictionary<string>): Dictionary<ActionMethod>;
