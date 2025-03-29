import ProductData from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load the header and footer
loadHeaderFooter();

// Function to get the category from the URL
function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Get the selected category from the URL
const category = getParam("category") || "tents"; // Default to "tents" if no category is provided

// Update the page title to include the category (if a title element exists)
const titleElement = document.querySelector(".page-title");
if (titleElement) {
  titleElement.textContent =
    "Top Products: " + category.charAt(0).toUpperCase() + category.slice(1);
}

// Create an instance of ProductData (no preset category)
const productData = new ProductData();

// Select the element where product cards will be rendered
const listElement = document.querySelector(".product-list");

// Create and initialize a new ProductList instance
const productList = new ProductList(category, productData, listElement);
productList.init();
