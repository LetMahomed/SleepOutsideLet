import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []; // Ensure cart is an array, even if it's empty
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // After rendering cart, update the total
  updateTotal(cartItems); // Pass cartItems to updateTotal
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
  return newItem;
}

// Function to calculate the total
function updateTotal(cartItems) {
  let total = 0;
  cartItems.forEach((item) => {
    total += item.FinalPrice; // Ensure you're using the correct price field
  });

  // Update the total amount on the page
  document.getElementById("total-amount").textContent = total.toFixed(2); // Format the total to 2 decimal places

  // Unhide the cart-footer once the total is calculated
  document.querySelector(".cart-footer").classList.remove("hide");
}

// Call the function to render cart and set the total when the page loads
renderCartContents();
