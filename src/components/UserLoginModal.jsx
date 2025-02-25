import { useRef, useEffect, useContext, useState } from "react";
import UserProgressContext from "../store/UserProgressContext";

const UserLoginModal = ({ open, onClose }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userProgressCtx = useContext(UserProgressContext);
  const dialogRef = useRef();

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [open]);

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;

    if (!name || !email) {
      setErrorMessage("Both name and email are required.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/user/meals`, {
        method: "GET",
        headers: { "Content-Type": "application/json", name, email },
      });

      if (response.ok) {
        const data = await response.json();

        // Store user data and meals in context
        userProgressCtx.setUser({ name, email });
        userProgressCtx.setUserMeals(data.meals);

        setErrorMessage("");
        onClose(); // Close the login modal
      } else {
        // If no meals found, save user details and set empty meals array
        const errorData = await response.json();
        if (errorData.message === "No meals found for this user.") {
          userProgressCtx.setUser({ name, email });
          userProgressCtx.setUserMeals([]);
          setErrorMessage("");
          onClose();
        } else {
          setErrorMessage(errorData.message);
        }
      }
    } catch (error) {
      setErrorMessage("Login failed. Try again.");
    }
  };

  return (
    <div className={`modal-backdrop ${open ? "open" : ""}`} onClick={onClose}>
    <dialog ref={dialogRef} className="modal" onClick={(e) => e.stopPropagation()}>
      <form id="login-form" className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <label htmlFor="name">Full Name</label>
        <input type="text" id="name" name="name" required />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Login</button>
        </div>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </dialog>
  </div>
  );
};

export default UserLoginModal;
