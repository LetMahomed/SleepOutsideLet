/**
 * Returns the first element matching the selector.
 */
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Retrieves data from localStorage.
 */
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

/**
 * Saves data to localStorage.
 */
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Renders a list of items using a template function.
 * @param {Function} templateFn - The function that returns an HTML string.
 * @param {HTMLElement} parentElement - The container element.
 * @param {Array} list - Array of items to render.
 * @param {string} [position="afterbegin"] - Insertion position.
 * @param {boolean} [clear=false] - Whether to clear the container first.
 */
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn).join("");
  parentElement.insertAdjacentHTML(position, htmlStrings);
}

/**
 * Template function that returns the HTML for a product card.
 */
export function productCardTemplate(product) {
  // Adjust image path if it starts with ".."
  let imageUrl = product.Image;
  if (imageUrl.startsWith("..")) {
    imageUrl = imageUrl.replace("..", "");
  }
  return `<li class="product-card">
    <a href="/product_pages/index.html?id=${product.Id}">
      <img src="${imageUrl}" alt="Image of ${product.Name}" />
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
    </a>
  </li>`;
}

export function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
) {
  parentElement.innerHTML = templateFn;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement)
  renderWithTemplate(footerTemplate, footerElement);
}
