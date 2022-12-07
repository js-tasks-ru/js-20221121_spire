export default class ColumnChart {
  chartHeight = 50;

  constructor({
    data = [],
    label = "",
    value = "",
    link = "",
    formatHeading = (data) => data,
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = formatHeading(value.toLocaleString("en-EN"));

    this.render();
  }

  getColumnProps() {
    if (!this.data.length) return [];

    if (this.element) {
      this.element.classList.remove("column-chart_loading");
    }

    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data
      .map((item) => {
        const percent = ((item / maxValue) * 100).toFixed(0);
        const value = String(Math.floor(item * scale));
        return `<div style="--value: ${value}" data-tooltip="${percent}%"></div>`;
      })
      .join("");
  }

  getTemplate() {
    return `
        <div class="column-chart column-chart_loading" style="--chart-height: ${
          this.chartHeight
        }">
          <div class="column-chart__title">
            Total ${this.label}
            <a href="${this.link}" class="column-chart__link">View all</a>
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${
              this.value
            }</div>
            <div data-element="body" class="column-chart__chart">
              ${this.getColumnProps()}
            </div>
          </div>
        </div>
    `;
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove("column-chart_loading");
    }
    this.subElements = this.getSubElements();
  }

  getSubElements() {
    const result = {};
    let elements = this.element.querySelectorAll("[data-element]");

    for (let subElement of elements) {
      const elem = subElement.dataset.element;
      result[elem] = subElement;
    }
    return result;
  }

  update(data = []) {
    this.data = data;
    this.subElements.body.innerHTML = this.getColumnProps();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
