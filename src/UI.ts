export default class UI {
  private scoreEle: Element = null;

  // stats elements
  private statsElements: { [key: string]: Element } = null;

  constructor(
    defaultOptions: { [key: string]: boolean },
    initialStats: { [key: string]: string | number },
    onChange: (key: string, value: boolean) => void
  ) {
    // get score dispñayer element
    this.scoreEle = document.querySelector(".scoreText");

    // set default options values
    Object.entries(defaultOptions).forEach(([key, value]) => {
      const inputElement = document.getElementById(key) as HTMLInputElement;
      if (inputElement == null) {
        throw new Error(`Couldn't find input with id: "${key}"`);
      }
      inputElement.checked = value;
    }, {});

    // set initial stats values
    this.statsElements = Object.entries(initialStats).reduce(
      (prev, [key, value]) => {
        const element = document.querySelector(`.stats .${key}`) as Element;
        if (element == null) {
          throw new Error(`Couldn't find element with class: "${key}"`);
        }
        element.innerHTML = value.toString();
        return {
          ...prev,
          [key]: element,
        };
      },
      {}
    );

    // listen to form's onChange event
    document.getElementById("options-form").onchange = (e: Event) => {
      // @ts-ignore
      onChange(e.target.id, e.target.checked);
    };
  }

  public updateScore = (score: number) => {
    this.scoreEle.innerHTML = score.toString();
  };

  public updateStats = (key: string, value: string | number) => {
    if (this.statsElements[key] != null) {
      this.statsElements[key].innerHTML = value.toString();
    }
  };
}
