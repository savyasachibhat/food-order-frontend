import { useEffect, useRef, useContext } from "react";
import { createPortal } from "react-dom";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";

const CartModal = ({ open, onClose }) => {
  const cartctx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const dialog = useRef();

  // Open and close modal based on 'open' prop
  useEffect(() => {
    const modal = dialog.current;
    if (open) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [open]); // Only triggers on 'open' state change

  const cartTotal = cartctx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleCloseCart() {
    userProgressCtx.hideCart();
  }

 

  return createPortal(
    <div
      className={`cart-modal-backdrop ${open ? "open" : ""}`}
      onClick={onClose}
    >
      <dialog
        ref={dialog}
        className="cart-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={onClose}>
          &times;
        </button>{" "}
        {/* Close button */}
        <h2>Your Cart</h2>
        {cartctx.items.length > 0 ? (
          <>
            <ul>
              {cartctx.items.map((item) => (
                <li key={item._id}>
                  <p>
                    {item.name} - {item.quantity}
                  </p>
                  <p className="cart-item-actions">
                    <button onClick={() => cartctx.removeItem(item._id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => cartctx.addItem(item)}>+</button>
                  </p>
                </li>
              ))}
            </ul>
            <p className="cart-total">Total: ₹ {cartTotal.toFixed(2)}</p>
            <div className="modal-actions">
              <button onClick={onClose}>Close</button>
              
              <button onClick={() => cartctx.clearCart()}>Clear Cart</button>  
              {cartctx.items.length > 0 && (
                <button onClick={() => userProgressCtx.showCheckout()}>
                  Go to Checkout
                </button>
              )}
            </div>
          </>
        ) : (
          <p>Your cart is empty</p>
        )}
      </dialog>
    </div>,
    document.getElementById("modal")
  );
};

export default CartModal;
