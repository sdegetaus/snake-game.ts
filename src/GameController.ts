import Canvas from "./Canvas";
import { COLOR_PALETTE, UNIT_SIZE } from "./consts";
import { Direction, Vector2 } from "./types";

export default class GameController {
  private width: number;
  private height: number;

  private mainCanvas: Canvas;
  private bgCanvas: Canvas; // TODO

  private head: Vector2;
  private tail: Vector2[] = [];
  private food: Vector2;
  private direction: Direction = Direction.Left;
  private timer: NodeJS.Timeout;

  constructor() {
    this.width = 256;
    this.height = this.width * 0.5;

    this.mainCanvas = new Canvas("main-canvas", this.width, this.height);
    this.bgCanvas = new Canvas("bg-canvas", this.width, this.height);

    const container = document.getElementById("container");
    container.style.width = `${this.width * 4}px`;
    container.style.height = `${this.height * 4}px`;

    const debugStart: Vector2 = {
      x: this.width / (UNIT_SIZE / 2),
      y: this.height / (UNIT_SIZE / 2),
    };
    for (let i = 0; i < 1000; i++) {
      this.tail.push({ ...debugStart, x: debugStart.x - UNIT_SIZE * i });
    }

    this.head = debugStart;

    this.setFood();
    this.registerEvents();
    this.blit();
    this.timer = setInterval(this.run, 50);

    // on click start
    // on "p" pause
  }

  registerEvents = () => {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          if (this.direction !== Direction.Down) {
            this.direction = Direction.Up;
          }
          break;
        case "d":
        case "ArrowRight":
          if (this.direction !== Direction.Right) {
            this.direction = Direction.Left;
          }
          break;
        case "s":
        case "ArrowDown":
          if (this.direction !== Direction.Up) {
            this.direction = Direction.Down;
          }
          break;
        case "a":
        case "ArrowLeft":
          if (this.direction !== Direction.Left) {
            this.direction = Direction.Right;
          }
          break;
        case "p":
          console.log("pause");
          break;
        default:
          return;
      }
    });
  };

  private run = () => {
    this.moveSnake();
    this.collisions();
    this.blit();
  };

  private moveSnake = () => {
    if (this.tail.length !== 0) {
      for (let i = this.tail.length - 1; i >= 1; i--) {
        this.tail[i] = this.tail[i - 1];
      }
      this.tail[0] = { ...this.head };
    }
    switch (this.direction) {
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
  };

  private setFood = () => {
    this.food = {
      x:
        UNIT_SIZE *
        Math.round((Math.random() * (this.width - UNIT_SIZE)) / UNIT_SIZE),
      y:
        UNIT_SIZE *
        Math.round((Math.random() * (this.height - UNIT_SIZE)) / UNIT_SIZE),
    };
  };

  private drawFood = () => {
    this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.FOOD;
    this.mainCanvas.ctx.fillRect(
      this.food.x,
      this.food.y,
      UNIT_SIZE,
      UNIT_SIZE
    );
  };

  private drawHead = () => {
    this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.HEAD;
    this.mainCanvas.ctx.fillRect(
      this.head.x,
      this.head.y,
      UNIT_SIZE,
      UNIT_SIZE
    );
  };

  private drawTail = () => {
    this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.TAIL;
    this.tail.forEach((pos) => {
      this.mainCanvas.ctx.fillRect(pos.x, pos.y, UNIT_SIZE, UNIT_SIZE);
    });
  };

  private drawBg = () => {
    this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.BG;
    this.mainCanvas.ctx.fillRect(0, 0, this.width, this.height);
  };

  private blit = () => {
    this.drawBg();
    this.drawFood();
    this.drawTail();
    this.drawHead();
  };

  private collisions = () => {
    this.wrap();
    this.tail.forEach(({ x, y }) => {
      if (x === this.head.x && y === this.head.y) {
        console.log("Self-collide");
        return;
      }
    });
    if (this.head.x === this.food.x && this.head.y === this.food.y) {
      this.onEat();
    }
  };

  private onEat = () => {
    this.tail.unshift({ x: this.head.x, y: this.head.y });
    this.setFood();
  };

  private wrap = () => {
    if (this.head.x < 0) {
      this.head = {
        ...this.head,
        x: this.width - UNIT_SIZE,
      };
      return;
    }
    if (this.head.x > this.width - UNIT_SIZE) {
      this.head = {
        ...this.head,
        x: 0,
      };
      return;
    }
    if (this.head.y < 0) {
      this.head = {
        ...this.head,
        y: this.height - UNIT_SIZE,
      };
      return;
    }
    if (this.head.y > this.height - UNIT_SIZE) {
      this.head = {
        ...this.head,
        y: 0,
      };
      return;
    }
  };
}
