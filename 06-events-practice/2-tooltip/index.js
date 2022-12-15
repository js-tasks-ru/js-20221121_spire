class Tooltip {
  static instance;

  handleOver = (event) => {
    const anchor = event.target.closest("[data-tooltip]");
    if (!anchor) return;
    anchor.onmousemove = (event) => this.handleMove(event);
    anchor.onmouseout = () => this.remove();
  };

  handleMove = (event) => {
    const anchor = event.target.closest("[data-tooltip]");
    this.render(anchor, { clientX: event.clientX, clientY: event.clientY });
  };

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }
    return Tooltip.instance;
  }

  initialize() {
    document.addEventListener("pointerover", this.handleOver);
  }

  render(anchor, { clientX, clientY }) {
    this.remove();
    const div = document.createElement("div");
    div.innerHTML = anchor.dataset.tooltip;
    div.className = "tooltip";
    div.style.top = clientY + 15 + "px";
    div.style.left = clientX + 10 + "px";
    this.element = div;
    document.body.append(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
      document.removeEventListener("pointerover", this.handleOver);
    }
  }

  destroy() {
    if (this.element) {
      this.remove();
    }
  }
}

export default Tooltip;
