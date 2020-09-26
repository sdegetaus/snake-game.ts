export default class UI {
  // ui elements
  private scoreElement: Element = null;

  constructor() {
    this.scoreElement = document.querySelector(".ui.score");

    // fill copyright year
    document.querySelector(
      ".ui.year"
    ).innerHTML = new Date().getFullYear().toString();
  }

  public updateScore = (score: number) => {
    this.scoreElement.innerHTML = score.toString();
  };
}
