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

// down = 3, up = 1
// (3 + 2) % 4 = 1

// up = 1, down = 3
// (1 + 2) % 4 = 3

// Left = 2, right = 4
// (2 + 2) % 4 = 0

// right = 4, left = 2
// (4 + 2) % 4 = 2
