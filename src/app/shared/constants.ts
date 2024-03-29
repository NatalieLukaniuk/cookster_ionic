export const AVERAGE_PORTION: number = 250;

export const SEPARATOR: string = '/';

export const areSetsEqual = (a: Set<any>, b: Set<any>) =>
  !!a && !!b && a.size === b.size && [...a].every((value) => b.has(value));

export const SIDEBAR_EXPANDED_WIDTH = 981;

export const INPUT_DEBOUNCE_TIME = 700;