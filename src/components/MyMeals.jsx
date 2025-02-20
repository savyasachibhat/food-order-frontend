import { useContext, useEffect } from "react";
import UserProgressContext from "../store/UserProgressContext";
import { Link } from "react-router-dom";

const MyMeals = () => {
  const { user, userMeals, setUserMeals } = useContext(UserProgressContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user) {
      const fetchMeals = async () => {
        try {
          const response = await fetch(`${backendUrl}/user/meals`, {
            method: "GET",
            headers: { 
              "Content-Type": "application/json",
              name: user.name,
              email: user.email
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserMeals(data.meals);
          } else {
            // If no meals found, set empty array
            setUserMeals([]);
          }
        } catch (error) {
          console.error("Error fetching meals:", error);
        }
      };
      fetchMeals();
    }
  }, [user, backendUrl, setUserMeals]);

  return (
    <div className="thanks-page-wrapper">
      <div className="thanks-page">
        <h1>{user ? `${user.name}'s Ordered Meals` : "My Meals"}</h1>
        {userMeals.length === 0 ? (
          <p>No meals found.</p>
        ) : (
          <ul>
            {userMeals.map((meal, index) => (
              <li key={index}>
                <strong>{meal.name}</strong> - {meal.quantity} x ₹{meal.price}
              </li>
            ))}
          </ul>
        )}
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default MyMeals;
