function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad response from server");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // The JSON file should be in public/json/
    this.path = `/json/${this.category}.json`;
  }

  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
