import { useRef, useEffect, useContext } from "react";
import CartContext from "../store/CartContext";

const UserLoginModal = ({ open, onClose }) => {
  const cartctx = useContext(CartContext);
  const dialogRef = useRef();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

 const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const userData = Object.fromEntries(fd.entries());

    // Fetch cart data based on user email
    try {
      const response = await fetch(`http://localhost:5000/cart/${userData.email}`);
      const cartData = await response.json();

      if (response.ok) {
        const updatedItems = cartData.items.map(item => ({
          ...item,
          quantity: item.quantity,
          price: item.price
        }));
        cartctx.setItems(updatedItems);

        // Recalculate the total amount
        const totalAmount = updatedItems.reduce((total, item) => total + item.quantity * item.price, 0);
        cartctx.setTotalAmount(totalAmount);

        console.log('User data:', userData);
        onClose(); // Close the modal after login
      } else {
        console.error('Failed to fetch cart data:', cartData.message);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  
   

  return (
    <div
      className={`login-modal-backdrop ${open ? "open" : ""}`}
      onClick={onClose}
    >
      <dialog
        ref={dialogRef}
        className="user-login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <form id="login-form" onSubmit={handleLoginSubmit}>
          <h2>Login</h2>

          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Login</button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default UserLoginModal;
