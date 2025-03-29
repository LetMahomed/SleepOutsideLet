const baseURL = import.meta.env.VITE_SERVER_URL;

// Utility function to convert the response to JSON and handle errors
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad response from server");
  }
}

export default class ExternalServices {
  constructor() {
    // You could initialize any required configurations here..bla bla
  }

  // Fetch products by category
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; // Assuming 'Result' holds the list of products
  }

  // Fetch a single product by its ID
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result; // Assuming 'Result' holds the product details
  }

  // Submit the order to the server
  async submitOrder(orderData) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    };

    try {
      const response = await fetch(`${baseURL}checkout`, options);
      const result = await convertToJson(response);
      return result; // Server response (JSON)
    } catch (error) {
      console.error("Error submitting order:", error);
      return { success: false, message: "An error occurred during checkout." };
    }
  }
}
