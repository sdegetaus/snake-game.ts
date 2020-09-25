import Snake from "./Snake";
import Canvas from "./Canvas";
import { COLOR_PALETTE, UNIT_SIZE } from "./library/consts";
import { Direction, Vector2 } from "./library/types";

export default class GameController {
  private width: number;
  private height: number;

  private mainCanvas: Canvas;
  private bgCanvas: Canvas; // TODO

  private direction: Direction = Direction.Left;
  private timer: NodeJS.Timeout;

  private food: Vector2;
  private snake: Snake;

  constructor(width: number) {
    this.width = width;
    this.height = width * 0.5;

    this.mainCanvas = new Canvas("main-canvas", this.width, this.height);
    this.bgCanvas = new Canvas("bg-canvas", this.width, this.height);

    const container = document.getElementById("container");
    container.style.width = `${this.width * 4}px`;
    container.style.height = `${this.height * 4}px`;

    this.snake = new Snake({ x: 0, y: 0 }, this.handleCollide, this.handleEat);

    this.setFoodPosition();
    this.registerEvents();
    this.blit();
    this.timer = setInterval(this.loop, 50);

    // TODO:
    // on click start
    // on "p" pause
    // separate snake
    // layers
  }

  private registerEvents = () => {
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

  private loop = () => {
    this.snake.move(this.direction, this.width, this.height, this.food);
    this.blit();
  };

  private setFoodPosition = () => {
    // todo: dont draw on snake tails or header
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

  private drawSnake = () => {
    // draw tail
    this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.TAIL;
    this.snake.getTail().forEach((pos) => {
      this.mainCanvas.ctx.fillRect(pos.x, pos.y, UNIT_SIZE, UNIT_SIZE);
    });
    // draw head
    this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.HEAD;
    this.mainCanvas.ctx.fillRect(
      this.snake.head.x,
      this.snake.head.y,
      UNIT_SIZE,
      UNIT_SIZE
    );
  };

  private drawBg = () => {
    this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.BG;
    this.mainCanvas.ctx.fillRect(0, 0, this.width, this.height);
  };

  private blit = () => {
    this.drawBg();
    this.drawFood();
    this.drawSnake();
  };

  private handleCollide = () => {
    console.log("Self-collided");
  };

  private handleEat = () => {
    this.setFoodPosition();
  };
}