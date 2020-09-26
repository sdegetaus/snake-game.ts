import Canvas from "./Canvas";
import { COLOR_PALETTE } from "./library/consts";

export default class Overlay {
  private overlayCanvas: Canvas = null;
  constructor(width: number, height: number) {
    this.overlayCanvas = new Canvas("#game .overlay", width, height);
    this.onStart(true);
  }

  public onStart = (enable: boolean) => {
    if (enable) {
      this.overlayCanvas.ctx.fillStyle = COLOR_PALETTE.HEAD;
      this.overlayCanvas.ctx.font = "28px RetroGaming";
      this.overlayCanvas.ctx.textAlign = "center";
      this.overlayCanvas.ctx.fillText(
        "Press the <space> key to start!",
        this.overlayCanvas.width / 2,
        10 + this.overlayCanvas.height / 2
      );
    } else {
      this.overlayCanvas.clear();
    }
  };

  public onPause = (enable: boolean) => {
    if (enable) {
      this.overlayCanvas.fill(`${COLOR_PALETTE.BG}CC`);
      this.overlayCanvas.ctx.fillStyle = COLOR_PALETTE.HEAD;
      this.overlayCanvas.ctx.font = "28px RetroGaming";
      this.overlayCanvas.ctx.textAlign = "center";
      this.overlayCanvas.ctx.fillText(
        "Press <p> to resume",
        this.overlayCanvas.width / 2,
        10 + this.overlayCanvas.height / 2
      );
    } else {
      this.overlayCanvas.clear();
    }
  };

  public onGameOver = (enable: boolean) => {
    if (enable) {
      this.overlayCanvas.fill(`${COLOR_PALETTE.RED}AA`);
      this.overlayCanvas.ctx.fillStyle = COLOR_PALETTE.HEAD;
      this.overlayCanvas.ctx.font = "28px RetroGaming";
      this.overlayCanvas.ctx.textAlign = "center";
      this.overlayCanvas.ctx.fillText(
        "Game Over!",
        this.overlayCanvas.width / 2,
        10 + this.overlayCanvas.height / 2
      );
    } else {
      this.overlayCanvas.clear();
    }
  };
}
