const arrOfElems = [];

export default class NotificationMessage {
  constructor(text = "", { duration = 0, type = "" } = {}) {
    this.text = text;
    this.duration = duration;
    this.type = type;

    this.show();
  }

  getTemplate() {
    return `<div class="notification ${this.type}" style="--value:${this.duration}ms">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.text}
                    </div>
                </div>
            </div>`;
  }

  render(targetElement) {
    if (arrOfElems.length) {
      arrOfElems.shift().remove();
    }

    if (targetElement) {
      this.element = targetElement;
    } else {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = this.getTemplate();
      this.element = wrapper.firstElementChild;
    }

    document.body.append(this.element);

    arrOfElems.push(this.element);
    this.timer = setTimeout(this.destroy.bind(this), this.duration);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    clearTimeout(this.timer);
  }
  show(targetElement) {
    this.render(targetElement);
  }
}
