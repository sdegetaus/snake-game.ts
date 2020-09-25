export default class Canvas {
  private canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  constructor(id: string, width: number, height: number) {
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = `${width * 4}px`;
    this.canvas.style.height = `${height * 4}px`;
  }
}
