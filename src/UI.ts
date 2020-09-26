import { Options } from "./library/types";

export default class UI {
  // ui elements
  private scoreEle: Element = null;

  constructor(
    defaultOptions: Options,
    onChange: (key: string, value: boolean) => void
  ) {
    this.scoreEle = document.querySelector(".scoreText");

    // fill copyright year
    document.querySelector(
      ".yearText"
    ).innerHTML = new Date().getFullYear().toString();

    // set default options values
    Object.entries(defaultOptions).reduce((prev, [key, value]) => {
      const element = document.getElementById(key) as HTMLInputElement;
      element.checked = value;
      return {
        ...prev,
        [key]: element,
      };
    }, {});

    // listen to form's onChange event
    document.getElementById("options-form").onchange = (e: Event) => {
      // @ts-ignore
      onChange(e.target.id, e.target.checked);
    };
  }

  public updateScore = (score: number) => {
    this.scoreEle.innerHTML = score.toString();
  };
}
