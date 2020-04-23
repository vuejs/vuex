// Types for the logger plugin. This file must be put alongside the bundled
// JavaScript file of the logger.

import { Payload, Plugin } from "../types/index";

export interface LoggerOption<S> {
  collapsed?: boolean;
  filter?: <P extends Payload>(mutation: P, stateBefore: S, stateAfter: S) => boolean;
  transformer?: (state: S) => any;
  mutationTransformer?: <P extends Payload>(mutation: P) => any;
  actionFilter?: <P extends Payload>(action: P, state: S) => boolean;
  actionTransformer?: <P extends Payload>(action: P) => any;
  logMutations?: boolean;
  logActions?: boolean;
}

export default function createLogger<S>(option?: LoggerOption<S>): Plugin<S>;
