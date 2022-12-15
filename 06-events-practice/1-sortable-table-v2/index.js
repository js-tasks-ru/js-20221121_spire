export default class SortableTable {
  sortBy = {
    order: "",
    field: "",
    type: "",
  };

  constructor(headerConfig = [], { data, sorted } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.getProductsContainer();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
    this.changeSortOrderEvent();
  }

  getProductsContainer() {
    return `<div 
                data-element="productsContainer" 
                class="products-list__container">

                <div class="sortable-table">
                    ${this.getHeaderTemplate()}
                    ${this.getBodyTemplate()}
                </div>

            </div>`;
  }

  getHeaderTemplate() {
    return `<div
              data-element="header"
              class="sortable-table__header sortable-table__row"
            >
              ${this.getHeaderTemplateRow()}
            </div>`;
  }

  getHeaderTemplateRow() {
    return `${this.headerConfig
      .map((cell) => {
        return `<div class="sortable-table__cell"
                  data-id="${cell.id}"
                  data-sortable="${cell.sortable}"
                  ${cell.sortable ? `data-order="${this.sorted.order}"` : ""}  
                >
                  <span>${cell.title}</span>
                  ${cell.sortable ? this.showSortArrow() : ""}
                </div>`;
      })
      .join("")}`;
  }

  showSortArrow() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>`;
  }

  getBodyTemplate() {
    return `<div 
                data-element="body" 
                class="sortable-table__body">         
                ${this.getBodyTemplateRow()}
            </div>`;
  }

  getBodyTemplateRow() {
    const headerConfig = Object.values(this.headerConfig);

    return this.getSort()
      .map((product) => {
        return `<a href="/products/${product.id}" class="sortable-table__row">
                    ${headerConfig
                      .map((item) => {
                        if (item.hasOwnProperty("template")) {
                          return item.template(product[item.id]);
                        }
                        return `<div class="sortable-table__cell">${
                          product[item.id]
                        }</div>`;
                      })
                      .join("")}
                </a>`;
      })
      .join("");
  }

  changeSortOrderEvent() {
    const { header } = this.subElements;
    const that = this;
    header.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const headerCell = e.target.parentElement.dataset;

      if (headerCell.element) return;
      if (headerCell.sortable === "false") return;

      headerCell.order =
        headerCell.order === "asc"
          ? (headerCell.order = "desc")
          : (headerCell.order = "asc");

      this.sortBy = {
        order: headerCell.order,
        field: headerCell.id,
        get type() {
          return that.headerConfig.filter((cell) => cell.id === this.field)[0]
            .sortType;
        },
      };

      this.update();
    });
  }

  getSort(field = this.sorted.id, order = this.sorted.order) {
    const arrCopy = [...this.data];

    let type = this.headerConfig.filter((cell) => cell.id === field)[0]
      .sortType;

    if (Object.values(this.sortBy)[0]) {
      field = this.sortBy.field;
      order = this.sortBy.order;
      type = this.sortBy.type;
    }

    const direction = {
      asc: 1,
      desc: -1,
    };

    return arrCopy.sort((a, b) => {
      const first = a[field];
      const second = b[field];

      if (type === "string") {
        return (
          direction[order] *
          first.localeCompare(second, ["ru", "en"], {
            caseFirst: "upper",
          })
        );
      }

      return direction[order] * (first - second);
    });
  }

  getSubElements() {
    const obj = {};
    const elems = this.element.querySelectorAll("[data-element]");

    for (const item of elems) {
      const name = item.dataset.element;
      obj[name] = item;
    }

    return obj;
  }

  update() {
    this.subElements.body.innerHTML = this.getBodyTemplateRow();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    if (this.element) {
      this.remove();
      this.subElements = null;
    }
  }
}
