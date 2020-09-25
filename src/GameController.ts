import Snake from "./Snake";
import Canvas from "./Canvas";
import { COLOR_PALETTE, UNIT_SIZE, STROKE_SIZE } from "./library/consts";
import { Direction, Vector2 } from "./library/types";

export default class GameController {
  // dimensions
  private width: number;
  private height: number;

  // ui elements
  private mainCanvas: Canvas;
  private bgCanvas: Canvas; // TODO

  private direction: Direction = Direction.Left;
  private timer: NodeJS.Timeout = null;
  private isRunning: boolean = false;

  private food: Vector2;
  private snake: Snake;

  private score: number = 0;

  constructor(width: number) {
    this.width = width - (width % UNIT_SIZE);
    this.height = this.width;

    this.mainCanvas = new Canvas("main-canvas", this.width, this.height);
    this.bgCanvas = new Canvas("bg-canvas", this.width, this.height);

    const container = document.getElementById("container");
    container.style.width = `${this.width}px`;
    container.style.height = `${this.height}px`;

    this.snake = new Snake({ x: 0, y: 0 }, this.handleCollide, this.handleEat);
    this.start();

    // TODO:
    // on click start
    // layers
  }

  private start = () => {
    this.setFoodPosition();
    this.registerEvents();
    this.blit();
    this.timer = setInterval(this.loop, 100);
    this.isRunning = true;
    this.drawBg();
  };

  private pause = () => {
    this.isRunning = false;
    clearInterval(this.timer);
    this.timer = null;
    console.log("test", this.timer);
  };

  private resume = () => {
    this.isRunning = true;
    this.timer = setInterval(this.loop, 100);
  };

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
          if (this.isRunning) {
            this.pause();
          } else {
            this.resume();
          }
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
    this.food = {
      x:
        UNIT_SIZE *
        Math.round((Math.random() * (this.width - UNIT_SIZE)) / UNIT_SIZE),
      y:
        UNIT_SIZE *
        Math.round((Math.random() * (this.height - UNIT_SIZE)) / UNIT_SIZE),
    };
    if (
      this.snake.head.x === this.food.x &&
      this.snake.head.y === this.food.y
    ) {
      this.setFoodPosition();
      return;
    }
    // todo: a faster way?
    this.snake.getTail().forEach((pos) => {
      if (pos.x === this.food.x && pos.y === this.food.y) {
        this.setFoodPosition();
        return;
      }
    });
  };

  private drawFood = () => {
    this.mainCanvas.ctx.beginPath();
    this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.FOOD;
    this.mainCanvas.ctx.rect(this.food.x, this.food.y, UNIT_SIZE, UNIT_SIZE);
    this.mainCanvas.ctx.fill();
    this.mainCanvas.ctx.stroke();
    this.mainCanvas.ctx.closePath();
  };

  private drawSnake = () => {
    this.mainCanvas.ctx.beginPath();
    // draw tail
    this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.TAIL;
    this.snake.getTail().forEach((pos) => {
      this.mainCanvas.ctx.rect(pos.x, pos.y, UNIT_SIZE, UNIT_SIZE);
    });
    this.mainCanvas.ctx.fill();
    this.mainCanvas.ctx.stroke();

    // draw head
    this.mainCanvas.ctx.beginPath();
    this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.HEAD;
    this.mainCanvas.ctx.rect(
      this.snake.head.x,
      this.snake.head.y,
      UNIT_SIZE,
      UNIT_SIZE
    );
    this.mainCanvas.ctx.fill();
    this.mainCanvas.ctx.stroke();
    this.mainCanvas.ctx.closePath();
  };

  private drawBg = () => {
    this.bgCanvas.ctx.fillStyle = COLOR_PALETTE.BG;
    this.bgCanvas.ctx.fillRect(0, 0, this.width, this.height);
  };

  private blit = () => {
    this.mainCanvas.ctx.strokeStyle = COLOR_PALETTE.BG;
    this.mainCanvas.ctx.lineWidth = STROKE_SIZE;
    this.mainCanvas.ctx.clearRect(0, 0, this.width, this.height);
    this.drawFood();
    this.drawSnake();
  };

  private handleCollide = () => {
    console.log("Self-collided");
  };

  private handleEat = () => {
    this.setFoodPosition();
    this.score++;
    console.log(`Score: ${this.score}`);
  };
}
