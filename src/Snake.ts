import { UNIT_SIZE } from "./library/consts";
import { Direction, Vector2 } from "./library/types";

export default class Snake {
  // parts
  public head: Vector2;
  private tail: Vector2[] = [];

  // callbacks
  private onCollide: () => void;
  private onEat: () => void;

  constructor(startPos: Vector2, onCollide: () => void, onEat: () => void) {
    for (let i = 0; i < 5; i++) {
      this.tail.push({
        x: UNIT_SIZE * -i,
        y: 0,
      });
    }
    this.head = startPos;
    this.onCollide = onCollide;
    this.onEat = onEat;
  }

  public getTail = () => this.tail;

  public move = (
    direction: Direction,
    width: number,
    height: number,
    food: Vector2
  ) => {
    // check self collide
    this.tail.forEach(({ x, y }) => {
      if (x === this.head.x && y === this.head.y) {
        this.onCollide();
      }
    });
    // did eat?
    if (this.head.x === food.x && this.head.y === food.y) {
      this.tail.unshift({ x: this.head.x, y: this.head.y });
      this.onEat();
    }
    // move the tail
    if (this.tail.length !== 0) {
      for (let i = this.tail.length - 1; i >= 1; i--) {
        this.tail[i] = this.tail[i - 1];
      }
      this.tail[0] = { ...this.head };
    }
    // move the head
    switch (direction) {
      case Direction.Up:
        this.head = { ...this.head, y: this.head.y - UNIT_SIZE };
        break;
      case Direction.Left:
        this.head = { ...this.head, x: this.head.x + UNIT_SIZE };
        break;
      case Direction.Down:
        this.head = { ...this.head, y: this.head.y + UNIT_SIZE };
        break;
      case Direction.Right:
        this.head = { ...this.head, x: this.head.x - UNIT_SIZE };
        break;
      default:
        break;
    }
    // check wrap
    if (this.head.x < 0) {
      this.head = {
        ...this.head,
        x: width - UNIT_SIZE,
      };
      return;
    }
    if (this.head.x > width - UNIT_SIZE) {
      this.head = {
        ...this.head,
        x: 0,
      };
      return;
    }
    if (this.head.y < 0) {
      this.head = {
        ...this.head,
        y: height - UNIT_SIZE,
      };
      return;
    }
    if (this.head.y > height - UNIT_SIZE) {
      this.head = {
        ...this.head,
        y: 0,
      };
      return;
    }
  };
}
