export const AVERAGE_PORTION: number = 250;

export const SEPARATOR: string = '/';

export const areSetsEqual = (a: Set<any>, b: Set<any>) =>
  !!a && !!b && a.size === b.size && [...a].every((value) => b.has(value));

export const ingredsThatAbsorbWater = [
  { id: '-N7yERTyA6igSASpL8pr', multiplyBy: 3 },
  { id: '-N7yE1TG3y6IkChv5dqQ', multiplyBy: 4 },
  { id: '-N7yDer8AE_KmK8qltlF', multiplyBy: 4 },
  { id: '-N5OkjRAfG4a3jGJRnXH', multiplyBy: 3 },
];
