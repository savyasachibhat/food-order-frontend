import { useNavigate } from "react-router-dom";
import logoimg from "../assets/OIP.jpg";
import { useContext, useState } from "react";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import CartModal from "./CartModal";
import CheckoutModal from "./CheckoutModal";
import UserLoginModal from "./UserLoginModal";


const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
 
  
  const cartctx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // const totalCartItems = cartctx.items.reduce((total, item) => {
  //   return total + item.quantity;
  // }, 0);

  const totalCartItems = cartctx.items.length;

  const handleOpenAdminModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  function handleShowCart() {
    userProgressCtx.showCart();
  }

  function handleCloseCart() {
    userProgressCtx.hideCart();
  }

  function handleCloseCheckout() {
    userProgressCtx.hideCheckout();
  }

  function handleShowUserLogin(){
    userProgressCtx.showUserLogin();
  }

 
  function handleCloseLogin (){
    userProgressCtx.hideUserLogin();
  }
    

  const handleAdminAccess1 = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          email: email,
          password: password,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Admin access granted", data);
        setErrorMessage("");
        navigate("/admin");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Error during admin access:", error);
      setErrorMessage("Access failed. Please try again.");
    }
  };



  const handleAdminAccess = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }
  
    try {
      const response = await fetch(`${backendUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.token);
        localStorage.setItem("adminToken", data.token); // Store JWT Token
        console.log("Admin access granted", data);
        setErrorMessage("");
        navigate("/admin");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Error during admin access:", error);
      setErrorMessage("Access failed. Please try again.");
    }
  };
  


  const handleMyMeals = () => {
    if (userProgressCtx.user) {
      navigate("/mymeals");
    } else {
      alert("Please log in first.");
    }
  };


  return (
    <>
      <header id="main-header">
        <div id="title">
          <img src={logoimg} alt="A restaurant" />
          <h1>TastyFood</h1>
        </div>
        <div className="btndiv">
          <button className="btn1" onClick={handleShowCart}>CART ({totalCartItems}) </button>
          <button className="btn2" onClick={handleOpenAdminModal}>
            Admin Login
          </button>
          {userProgressCtx.user ? (
          <button className="btn2" onClick={handleMyMeals}>My Meals</button>
        ) : (
          <button className="btn2" onClick={userProgressCtx.showUserLogin}>User Login</button>
        )}
         
        </div>
      </header>

      {showModal && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <dialog open className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Admin Login</h2>
            <form className="login-form" onSubmit={handleAdminAccess}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="admin-email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit">Login</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </dialog>
        </div>
      )}

      <CartModal open={userProgressCtx.progress === 'cart'} onClose={  handleCloseCart  } />
      <CheckoutModal open={userProgressCtx.progress === 'checkout'} onClose={handleCloseCheckout} />
      <UserLoginModal open ={userProgressCtx.progress=== 'login'} onClose={handleCloseLogin}/>
      
      
    </>
  );
};

export default Header;
