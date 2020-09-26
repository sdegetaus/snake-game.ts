// TODO:
// on click start
// layers

import Snake from "./Snake";
import Canvas from "./Canvas";
import UI from "./UI";
import { COLOR_PALETTE, UNIT_SIZE, STROKE_SIZE, DELAY } from "./library/consts";
import { Direction, Options, Vector2 } from "./library/types";

export default class GameController {
  // dimensions
  private width: number = 0;
  private height: number = 0;

  // ui elements
  private ui: UI = null;
  private mainCanvas: Canvas = null;
  private bgCanvas: Canvas = null;

  // timing & mechanics
  private direction: Direction = Direction.Left;
  private timer: NodeJS.Timeout = null;
  private isRunning: boolean = false;

  // objects
  private food: Vector2 = null;
  private snake: Snake = null;

  // data
  private score: number = 0;
  private options: Options = {
    gizmos: false,
    wrap: true,
  };

  constructor(width: number) {
    this.width = width - (width % UNIT_SIZE);
    this.height = this.width;

    this.mainCanvas = new Canvas("#game .main", this.width, this.height);
    this.bgCanvas = new Canvas("#game .bg", this.width, this.height);

    const layers = document.querySelector("#game .layers") as HTMLDivElement;
    if (layers == null) {
      throw new Error(`Couldn't find canvas container!`);
    }
    layers.style.width = `${this.width}px`;
    layers.style.height = `${this.height}px`;

    this.snake = new Snake({ x: 0, y: 0 }, this.handleCollide, this.handleEat);
    this.start();

    this.ui = new UI(this.options, this.handleOptionsChange);
  }

  private start = () => {
    this.setFoodPosition();
    this.registerEvents();
    this.blit();
    this.timer = setInterval(this.loop, DELAY);
    this.isRunning = true;
    this.drawBg();
  };

  private pause = () => {
    this.isRunning = false;
    clearInterval(this.timer);
    this.timer = null;
  };

  private resume = () => {
    this.isRunning = true;
    this.timer = setInterval(this.loop, DELAY);
  };

  private registerEvents = () => {
    document.addEventListener("keydown", (e) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          if (this.direction !== Direction.Down) {
            this.direction = Direction.Up;
          }
          return;
        case "d":
        case "arrowright":
          if (this.direction !== Direction.Right) {
            this.direction = Direction.Left;
          }
          return;
        case "s":
        case "arrowdown":
          if (this.direction !== Direction.Up) {
            this.direction = Direction.Down;
          }
          return;
        case "a":
        case "arrowleft":
          if (this.direction !== Direction.Left) {
            this.direction = Direction.Right;
          }
          return;
        case "p":
          if (this.isRunning) {
            this.pause();
          } else {
            this.resume();
          }
          return;
        default:
          return;
      }
    });
  };

  private loop = () => {
    this.snake.move(
      this.direction,
      this.width,
      this.height,
      this.food,
      this.options.wrap
    );
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

  private drawGizmos = () => {
    this.mainCanvas.ctx.beginPath();
    this.mainCanvas.ctx.moveTo(
      this.snake.head.x + Math.floor(UNIT_SIZE / 2),
      this.snake.head.y + Math.floor(UNIT_SIZE / 2)
    );
    this.mainCanvas.ctx.lineTo(
      this.food.x + Math.floor(UNIT_SIZE / 2),
      this.food.y + Math.floor(UNIT_SIZE / 2)
    );
    this.mainCanvas.ctx.strokeStyle = "blue";
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
    if (this.options.gizmos) {
      this.drawGizmos();
    }
  };

  private handleCollide = () => {
    console.log("Self-collided");
  };

  private handleEat = () => {
    this.setFoodPosition();
    this.ui.updateScore(++this.score);
  };

  private handleOptionsChange = (key: string, value: boolean) => {
    // @ts-ignore
    this.options[key] = value;
  };
}
