import { renderListWithTemplate, productCardTemplate } from "./utils.mjs";

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      const products = await this.dataSource.getData();
      // If the JSON items don’t have a "category" property, this filter will include all items.
      const filteredProducts = products.filter((product) => {
        if (this.category && product.category) {
          return product.category === this.category;
        }
        return true;
      });
      renderListWithTemplate(productCardTemplate, this.listElement, filteredProducts);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }
}
