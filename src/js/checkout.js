import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Load header and footer
loadHeaderFooter();

// Get the checkout form and feedback element for UI messages
const checkoutForm = document.getElementById("checkout-form");
const feedbackElement = document.getElementById("feedback");

// Instantiate CheckoutProcess with the key for localStorage and the order summary selector
const checkoutProcess = new CheckoutProcess("so-cart", ".order-summary");

// Initialize the checkout process to load cart items and calculate the subtotal.
checkoutProcess.init();
// Then calculate the order totals (tax, shipping, and overall total)
checkoutProcess.calculateOrderTotal();

// Listen for form submission
checkoutForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Retrieve all input fields from the form for basic empty-check validation
  const formFields = checkoutForm.querySelectorAll("input");
  let allFieldsValid = true;

  // Basic check: Ensure all fields are not empty
  formFields.forEach((field) => {
    const value = field.value.trim();
    if (!value) {
      allFieldsValid = false;
      field.style.border = "1px solid red";
    } else {
      field.style.border = "";
    }
  });

  if (!allFieldsValid) {
    feedbackElement.textContent = "Please fill out all fields.";
    feedbackElement.style.color = "red";
    return;
  }

  // Validate Credit Card Number: must exactly match "1234123412341234" for testing
  const cardNumberField = checkoutForm.querySelector(
    "input[name='cardNumber']",
  );
  const cardNumber = cardNumberField.value.trim();
  if (cardNumber !== "1234123412341234") {
    cardNumberField.style.border = "1px solid red";
    feedbackElement.textContent =
      "Invalid credit card number. Please use 1234123412341234 for testing.";
    feedbackElement.style.color = "red";
    return;
  }

  // Validate Expiration Date: should be in MM/YY format and not expired
  const expirationField = checkoutForm.querySelector(
    "input[name='expirationDate']",
  );
  const expirationValue = expirationField.value.trim();
  const [expMonth, expYear] = expirationValue
    .split("/")
    .map((val) => parseInt(val, 10));

  if (!expMonth || !expYear) {
    expirationField.style.border = "1px solid red";
    feedbackElement.textContent =
      "Please enter a valid expiration date in MM/YY format.";
    feedbackElement.style.color = "red";
    return;
  }

  // Get current month and last two digits of current year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear() % 100; // use last two digits

  if (
    expYear < currentYear ||
    (expYear === currentYear && expMonth < currentMonth)
  ) {
    expirationField.style.border = "1px solid red";
    feedbackElement.textContent = "The expiration date is expired.";
    feedbackElement.style.color = "red";
    return;
  }

  // Validate Zip Code: must be exactly 5 digits
  const zipField = checkoutForm.querySelector("input[name='zipCode']");
  const zipValue = zipField.value.trim();
  if (!/^\d{4,}$/.test(zipValue)) {
    zipField.style.border = "1px solid red";
    feedbackElement.textContent = "Zip Code must be more than 3 digits.";
    feedbackElement.style.color = "red";
    return;
  }  

  // If all validations pass, clear any previous feedback
  feedbackElement.textContent = "";

  // Proceed with the checkout process
  checkoutProcess
  .checkout(checkoutForm)
  .then((response) => {
    feedbackElement.textContent = "Order submitted successfully!";
    feedbackElement.style.color = "green";
    // Clear the cart from localStorage
    localStorage.removeItem("so-cart");
    // Redirect to thank you page after a short delay (e.g., 2 seconds)
    setTimeout(() => {
      window.location.href = "../thankyou/index.html";
    }, 2000);
  })
  .catch((error) => {
    feedbackElement.textContent =
      "There was an error submitting your order. Please try again.";
    feedbackElement.style.color = "red";
    console.error("Error submitting order:", error);
  });

});
