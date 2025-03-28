import { qs, getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ExternalServices.mjs";

// Load header and footer
loadHeaderFooter();

// Create an instance of ProductData (no preset category)
const dataSource = new ProductData();

async function renderProductDetail() {
  // Retrieve the product id from the URL query string (e.g., ?id=880RR)
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const productDetailEl = qs(".product-detail");

  if (!id) {
    productDetailEl.innerHTML = "<p>No product specified.</p>";
    return;
  }

  try {
    const product = await dataSource.findProductById(id);
    if (!product) {
      productDetailEl.innerHTML = "<p>Product not found.</p>";
      return;
    }

    const color = product.Colors && product.Colors.length > 0 ? product.Colors[0].ColorName : "";
    productDetailEl.innerHTML = `
      <h3>${product.Brand.Name}</h3>
      <h2 class="divider">${product.NameWithoutBrand}</h2>
      <img class="divider" src="${product.Images.PrimaryLarge}" alt="Image of ${product.Name}" />
      <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
      <p class="product__color">${color}</p>
      <p class="product__description">${product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    `;

    const addToCartBtn = qs("#addToCart");
    addToCartBtn.addEventListener("click", () => {
      addProductToCart(product);
      alert("Product added to cart!");
    });
  } catch (error) {
    console.error("Error rendering product detail:", error);
    productDetailEl.innerHTML = "<p>Error loading product details.</p>";
  }
}

function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

renderProductDetail();
