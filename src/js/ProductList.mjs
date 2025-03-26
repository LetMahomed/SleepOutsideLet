import { renderListWithTemplate, productCardTemplate } from "./utils.mjs";

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      // Pass category to getData.
      const products = await this.dataSource.getData(this.category);
      
      const filteredProducts = products.filter((product) => {
        if (this.category && product.category) {
          return product.category === this.category;
        }
        return true;
      });
      renderListWithTemplate(
        productCardTemplate,
        this.listElement,
        filteredProducts
      );
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }
}
