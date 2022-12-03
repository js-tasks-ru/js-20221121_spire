export default class ColumnChart {
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    link = '#',
    value = 0,
    formatHeading = false
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;

    this.isFormatHeading = formatHeading;
    this.value = this.getFormatHeading(value)

    this.columnProps = this.getColumnProps();
    this.isEmpty = (arguments.length === 0);

    this.render()
  }

  getFormatHeading(item) {
    item = item.toLocaleString('en-EN')
    if (this.isFormatHeading) {
      item = this.isFormatHeading(item)
    }
    return item
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }


  spellingData() {
    return this.columnProps
      .map(({ value, percent }) => {
        return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
      })
      .join('')
  }


  getTemplate() {
    return `
      <div class="dashboard__chart_${this.label} ${this.isEmpty ? 'column-chart_loading' : ''}">
        <div class="column-chart" style="--chart-height: 50">
          <div class="column-chart__title">
            Total ${this.label}
            <a href="${this.link}" class="column-chart__link">View all</a>
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${this.value}</div>
            <div data-element="body" class="column-chart__chart">
              ${this.spellingData()}
            </div>
          </div>
        </div>
      </div>
    `
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  update(data) {
    this.data = data;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
