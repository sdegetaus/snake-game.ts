import Canvas from "./Canvas";
import {
  COLOR_PALETTE,
  DELAY,
  ID,
  STROKE_SIZE,
  UNIT_SIZE,
} from "./library/consts";
import { BooleanPair, Direction, NumberPair, Vector2 } from "./library/types";
import Overlay from "./Overlay";
import Snake from "./Snake";
import UI from "./UI";

export default class GameController {
  // dimensions
  private width: number = 0;
  private height: number = 0;

  // ui elements
  private ui: UI = null;
  private overlay: Overlay = null;
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
  private options: BooleanPair = {
    gizmos: true,
    wrap: false,
    godMode: false,
  };
  private initialStats: NumberPair = {
    length: 1,
    distance: 0,
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

    this.overlay = new Overlay(this.width, this.height);

    const triggerStart = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case " ":
          document.removeEventListener("keydown", triggerStart);
          this.start();
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", triggerStart);
  }

  private start = () => {
    this.overlay.onStart(false);
    this.snake = new Snake(
      { x: this.width / 2, y: this.height / 2 },
      this.gameOver,
      this.handleEat
    );
    this.ui = new UI(this.options, this.initialStats, this.handleOptionsChange);
    this.bgCanvas.fill(COLOR_PALETTE.BG);
    this.setFoodPosition();
    this.registerEvents();
    this.blit();
    this.timer = setInterval(this.loop, DELAY);
    this.isRunning = true;
  };

  private pause = () => {
    this.overlay.onPause(true);
    clearInterval(this.timer);
    this.timer = null;
    this.isRunning = false;
  };

  private resume = () => {
    this.overlay.onPause(false);
    this.timer = setInterval(this.loop, DELAY);
    this.isRunning = true;
  };

  private gameOver = () => {
    if (this.options.godMode) {
      return;
    }
    this.overlay.onGameOver(true);
    clearInterval(this.timer);
    this.timer = null;
    this.isRunning = false;
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
          if (this.direction !== Direction.Left) {
            this.direction = Direction.Right;
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
          if (this.direction !== Direction.Right) {
            this.direction = Direction.Left;
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

  private draw = {
    food: () => {
      this.mainCanvas.ctx.beginPath();
      this.mainCanvas.ctx.fillStyle = COLOR_PALETTE.RED;
      this.mainCanvas.ctx.rect(this.food.x, this.food.y, UNIT_SIZE, UNIT_SIZE);
      this.mainCanvas.ctx.fill();
      this.mainCanvas.ctx.stroke();
      this.mainCanvas.ctx.closePath();
    },
    gizmos: () => {
      this.mainCanvas.ctx.beginPath();
      this.mainCanvas.ctx.moveTo(
        this.snake.head.x + Math.floor(UNIT_SIZE / 2),
        this.snake.head.y + Math.floor(UNIT_SIZE / 2)
      );
      this.mainCanvas.ctx.lineTo(
        this.food.x + Math.floor(UNIT_SIZE / 2),
        this.food.y + Math.floor(UNIT_SIZE / 2)
      );
      this.mainCanvas.ctx.strokeStyle = "limegreen";
      this.mainCanvas.ctx.stroke();
      this.mainCanvas.ctx.closePath();
      const distance =
        Math.hypot(
          this.food.x - this.snake.head.x,
          this.food.y - this.snake.head.y
        ) / UNIT_SIZE;
      this.ui.updateStats(ID.distance, distance.toFixed(2));
    },
    snake: () => {
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
    },
  };

  private blit = () => {
    this.mainCanvas.ctx.strokeStyle = COLOR_PALETTE.BG;
    this.mainCanvas.ctx.lineWidth = STROKE_SIZE;
    this.mainCanvas.clear();
    this.draw.food();
    this.draw.snake();
    if (this.options.gizmos) {
      this.draw.gizmos();
    }
  };

  private handleEat = () => {
    this.setFoodPosition();
    this.ui.updateScore(++this.score);
    this.ui.updateStats(ID.length, 1 + this.snake.getTail().length);
  };

  private handleOptionsChange = (key: string, value: boolean) => {
    // @ts-ignore
    this.options[key] = value;
    // todo: save options to localStorage
  };
}
