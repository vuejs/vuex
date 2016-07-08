/**
 * Types for the logger plugin.
 * This file must be put alongside the JavaScript file of the logger.
 */

import { MutationObject, Plugin } from './types/index'

export interface LoggerOption<S> {
  collapsed?: boolean;
  transformer?: (state: S) => any;
  mutationTransformer?: (mutation: MutationObject<any>) => any;
}

export default function createLogger<S>(option: LoggerOption<S>): Plugin<S>;
