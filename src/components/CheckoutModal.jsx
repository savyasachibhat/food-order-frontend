import { useRef, useEffect, useContext, useState } from "react";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { useNavigate } from "react-router-dom";

const CheckoutModal = ({ open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState(null);
  const dialog = useRef();
  const cartctx = useContext(CartContext);
  const navigate = useNavigate();
  const userProgressCtx = useContext(UserProgressContext);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Open and close modal based on 'open' prop
  useEffect(() => {
    const modal = dialog.current;
    if (open) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [open]);

  const cartTotal = cartctx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  async function handleCartSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const customerData = Object.fromEntries(fd.entries());

    // Add cart items to the customer data
    const orderData = {
      customer: customerData,
      items: cartctx.items,
      totalAmount: cartTotal,
    };

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${backendUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Order submitted successfully:", data);
        cartctx.clearCart();
        userProgressCtx.hideCheckout();

        navigate("/thankyou", { state: { orderData: orderData } });
        // Optionally clear the cart or show a success message
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit order");
        console.error("Failed to submit order:", errorData);
      }
    } catch (error) {
      setError(error.message || "Error during order submission");
      console.error("Error during order submission:", error);
    }
    setIsLoading(false);
  }

  return (
    <>
      <div
        className={`checkout-modal-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
      >
        <dialog
          ref={dialog}
          className="checkout-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close" onClick={onClose}>
            &times;
          </button>{" "}
          {/* Close button */}
          <form onSubmit={handleCartSubmit}>
            <h2>Checkout</h2>
            <p>Total Amount: {cartTotal}</p>

            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="email">E-Mail Address</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="street">Street</label>
            <input type="text" id="street" name="street" required />

            <div className="control-row">
              <div>
                <label htmlFor="postal-code">Pin Code</label>
                <input type="text" id="postal-code" name="pincode" required />
              </div>
              <div>
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" required />
              </div>
            </div>
            {Error && <div className="error-message">{Error}</div>}

            <div className="modal-actions">
              {!isLoading && <button onClick={onClose}>Cancel</button>}
              <button type="submit">
                {isLoading ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </>
  );
};

export default CheckoutModal;
