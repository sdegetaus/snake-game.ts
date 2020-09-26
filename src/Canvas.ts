export default class Canvas {
  private canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  constructor(query: string, width: number, height: number) {
    this.canvas = document.querySelector(query) as HTMLCanvasElement;
    if (this.canvas == null) {
      throw new Error(`Couldn't find canvas element with query: "${query}"`);
    }
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
