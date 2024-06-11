import { useState } from "react";
import axios from "axios";

function Checkout() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/payments/create-checkout-session/",
        {
          product_name: productName,
          price: price,
        }
      );
      window.location.href = response.data.url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Error creating checkout session", error);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price (in cents)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}

export default Checkout;
