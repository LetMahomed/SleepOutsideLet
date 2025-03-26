import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load the header and footer
loadHeaderFooter();

// Create an instance of ProductData for the "tents" category
const productData = new ProductData("tents");

// Select the element where product cards will be rendered
const listElement = document.querySelector(".product-list");

// Create and initialize a new ProductList instance
const productList = new ProductList("tents", productData, listElement);
productList.init();


