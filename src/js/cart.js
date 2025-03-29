import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []; // Ensure cart is an array, even if it's empty
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".cart-product-list").innerHTML = htmlItems.join("");

  // Attach event listeners for remove buttons after rendering
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      const idToRemove = button.getAttribute("data-id");
      removeItemFromCart(idToRemove);
    });
  });

  // After rendering cart, update the total
  updateTotal(cartItems); // Pass cartItems to updateTotal
}

function cartItemTemplate(item) {
  // Use PrimaryLarge if available, otherwise fallback to item.Image
  const imageUrl =
    item.Images && item.Images.PrimaryLarge
      ? item.Images.PrimaryLarge
      : item.Image || "/images/default-product.jpg";

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${imageUrl}" alt="${item.Name}" onerror="this.src='/images/default-product.jpg'" />
    </a>
    <div class="cart-card__details">
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </div>
    <span class="remove-item" data-id="${item.Id}" title="Remove this item">X</span>
  </li>`;
}

// Function to calculate the total and update UI
function updateTotal(cartItems) {
  let total = 0;
  cartItems.forEach((item) => {
    total += item.FinalPrice;
  });

  // Update the total amount on the page
  document.getElementById("total-amount").textContent = total.toFixed(2);

  // Select the checkout button
  const checkoutButton = document.querySelector(".checkout-button");

  // If there are no items, disable the checkout button
  if (cartItems.length === 0) {
    checkoutButton.classList.add("disabled");
    // Remove the href attribute to prevent navigation
    checkoutButton.removeAttribute("href");
  } else {
    checkoutButton.classList.remove("disabled");
    // Restore the href if needed (adjust the path as appropriate)
    checkoutButton.setAttribute("href", "../checkout/index.html");
  }

  // Unhide the cart-footer once the total is calculated
  document.querySelector(".cart-footer").classList.remove("hide");
}

// Function to remove an item from the cart
function removeItemFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || [];
  // Remove the item whose id matches the provided id
  cartItems = cartItems.filter((item) => item.Id !== id);
  setLocalStorage("so-cart", cartItems);
  renderCartContents(); // Re-render the cart after removal
}

// Call the function to render cart and set the total when the page loads
renderCartContents();
