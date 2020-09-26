export default class Canvas {
  // dimensions
  public width: number = 0;
  public height: number = 0;

  private canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  constructor(query: string, width: number, height: number) {
    this.canvas = document.querySelector(query) as HTMLCanvasElement;
    if (this.canvas == null) {
      throw new Error(`Couldn't find canvas element with query: "${query}"`);
    }
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;
  }

  public clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  public fill = (color: string) => {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };
}
