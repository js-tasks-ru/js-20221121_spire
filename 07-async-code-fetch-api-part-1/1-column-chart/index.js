import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class ColumnChart {
  chartHeight = 50;

  constructor({
    url = "",
    range = {},
    label = "",
    link = "",
    formatHeading = (data) => data,
  } = {}) {
    this.data = [];
    this.formatHeading = formatHeading;
    this.url = url;
    this.range = range;

    this.label = label;
    this.link = link;

    this.value = 0;
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
    this.update();
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const elem = subElement.dataset.element;
      result[elem] = subElement;
    }
    return result;
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

  update(from = this.range.from, to = this.range.to) {
    fetchJson(`${BACKEND_URL}/${this.url}?from=${from}&to=${to}`)
      .then((result) => {
        this.data = Object.values(result);
        const sumOfData = this.data.reduce((sum, item) => sum + item);
        this.value = this.formatHeading(sumOfData.toLocaleString("en-EN"));

        this.subElements.header.innerHTML = this.value;
        this.subElements.body.innerHTML = this.getColumnProps();
      })
      .catch((err) => console.log(new Error(err)));
  }
}
