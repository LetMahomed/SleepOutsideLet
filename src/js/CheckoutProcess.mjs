import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    // Initialize ExternalServices to handle server communication
    this.externalServices = new ExternalServices();
  }

  // Initialize the checkout process by retrieving cart items and calculating the subtotal
  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
  }

  // Calculate the item subtotal from cart items
  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (total, item) => total + (item.FinalPrice || 0),
      0
    );
    this.displayItemSubTotal();
  }

  // Calculate tax, shipping, and the final order total, then display them
  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06; // 6% sales tax
    this.shipping = this.calculateShipping();
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  // Calculate shipping cost: $10 for the first item and $2 for each additional item
  calculateShipping() {
    const itemCount = this.list.length;
    return itemCount === 0 ? 0 : 10 + (itemCount - 1) * 2;
  }

  // Update the UI with the calculated item subtotal
  displayItemSubTotal() {
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #subtotal`
    );
    subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  // Update the UI with the tax, shipping, and overall order total
  displayOrderTotals() {
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElement = document.querySelector(
      `${this.outputSelector} #shipping`
    );
    const orderTotalElement = document.querySelector(
      `${this.outputSelector} #order-total`
    );

    taxElement.innerText = `$${this.tax.toFixed(2)}`;
    shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems() {
    return this.list.map((item) => ({
      id: item.id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: 1, // Assuming each product is added once
    }));
  }

  /**
   * Processes the checkout by gathering form data, preparing the order object,
   * and sending it to the server.
   *
   * @param {HTMLFormElement} form - The checkout form element.
   * @returns {Promise<Object>} The server response if the order is submitted successfully.
   */
  async checkout(form) {
    // Convert the form data to a FormData object for easy access
    const formData = new FormData(form);
    // Build the order object with keys matching the server's expectations
    const orderData = {
      orderDate: new Date().toISOString(), // Current date/time
      fname: formData.get("firstName"),
      lname: formData.get("lastName"),
      street: formData.get("streetAddress"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zipCode"),
      cardNumber: formData.get("cardNumber"),
      expiration: formData.get("expirationDate"),
      code: formData.get("securityCode"),
      items: this.packageItems(),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    try {
      // Send the order data to the server via the ExternalServices module
      const response = await this.externalServices.submitOrder(orderData);
      console.log("Order submitted successfully:", response);
      return response; // Return the response for further UI handling
    } catch (error) {
      console.error("Error submitting order:", error);
      // Propagate the error to the caller so it can be handled in the UI
      throw error;
    }
  }
}
