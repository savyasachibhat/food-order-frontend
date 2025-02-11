import { useState, useEffect, useContext } from "react";
import CartContext from "../store/CartContext";
import Header from "./Header";

const MainPage = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const cartctx = useContext(CartContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const response = await fetch(`${backendUrl}/meals`);
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
        setFetchError(error.message);
      }
      setLoading(false);
    };

    fetchMeals();
  }, [backendUrl]);

  // const correctEmail = 'admin@gmail.com';
  // const correctPassword = 'admin1234';

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (email === correctEmail && password === correctPassword) {
  //     setErrorMessage('');
  //     navigate('/admin');
  //   } else {
  //     setErrorMessage('Invalid email or password.');
  //   }
  // };

  function addToCart(meal) {
    cartctx.addItem(meal);
   
  }
  return (
    <>
      <Header />

      <div className="meals-container">
        <h1>Meals List</h1>

        {loading && <p>Loading...</p>}
        {fetchError && <p>{fetchError}</p>}

        <ul className="meals-grid">
          {meals.map((meal) => (
            <li key={meal._id} className="meal-item">
              <img src={meal.image} alt="image of food" />
              <h2>{meal.name}</h2>
              <p>Price: ₹ {meal.price}</p>
             
              <button onClick={() => addToCart(meal)}>Add to Cart</button>
             
             
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MainPage;
