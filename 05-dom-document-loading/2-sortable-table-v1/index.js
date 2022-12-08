export default class SortableTable {
  objSortType = {};

  selectedField = "title";
  selectedOrder = "asc";

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.getProductsContainer();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
  }

  update() {
    if (this.element) {
      this.subElements.body.innerHTML = this.getTemplateBody();
    }
  }

  sort(a, b) {
    this.selectedField = a;
    this.selectedOrder = b;
    this.update();
  }

  getProductsContainer() {
    return `<div data-element="productsContainer" class="products-list__container">
              <div class="sortable-table">
                <div
                  data-element="header"
                  class="sortable-table__header sortable-table__row"
                >
                  ${this.getTemplateHeader()}
                </div>
                <div data-element="body" class="sortable-table__body">
                  ${this.getTemplateBody()}
                </div>
                
              </div>
            </div>`;
  }

  getTemplateHeader() {
    return this.headerConfig
      .map((item) => {
        this.objSortType[item.id] = item.sortType || false;

        return `<div
                class="sortable-table__cell"
                data-id="${item.id}"
                data-sortable="${item.sortable}"
              >
                <span>${item.title}</span>
              </div>`;
      })
      .join("");
  }

  getTemplateBody() {
    const arrOfBodyValues = this.getHeadersCellId();

    return this.getSort()
      .map((product) => {
        return `<a href="/products/${product.id}" class="sortable-table__row">
                    ${arrOfBodyValues
                      .map((value) => {
                        if (value === "images") {
                          return this.getBodyImageTemplate(product.images);
                        }
                        return `<div class="sortable-table__cell">${product[value]}</div>`;
                      })
                      .join("")}
                  
                </a>`;
      })
      .join("");
  }

  getHeadersCellId() {
    const arr = [];

    this.headerConfig.map((cell) => {
      arr.push(cell.id);
    });
    return arr;
  }

  getSort(field = "title", order = "asc") {
    const arrCopy = [...this.data];
    field = this.selectedField;
    order = this.selectedOrder;

    const direction = {
      asc: 1,
      desc: -1,
    };

    return arrCopy.sort((a, b) => {
      a = a[field];
      b = b[field];

      if (this.objSortType[field] === "string") {
        return (
          direction[order] *
          a.localeCompare(b, ["ru", "en"], {
            caseFirst: "upper",
          })
        );
      }

      return direction[order] * (a - b);
    });
  }

  getBodyImageTemplate(item) {
    const arr = this.headerConfig.filter((cell) => cell.id === "images");
    return (
      arr[0].template?.(item) ||
      `<div class="sortable-table__cell">
        <img  class="sortable-table-image" 
              alt="Image" 
              src="${item[1]?.url || "https://via.placeholder.com/32"}">
        </div>`
    );
  }

  getSubElements() {
    const obj = {};
    const body = this.element.querySelectorAll("[data-element]");

    for (let item of body) {
      const name = item.dataset.element;
      obj[name] = item;
    }

    return obj;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    if (this.element) {
      this.remove();
      this.subElements = {};
    }
  }
}
