export enum Direction {
  Up = 1,
  Left,
  Down,
  Right,
}

export type Vector2 = {
  x: number;
  y: number;
};

export type Options = {
  gizmos: boolean;
  wrap: boolean;
};
