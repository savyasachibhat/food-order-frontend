import { useContext } from "react";
import UserProgressContext from "../store/UserProgressContext";
import { Link } from "react-router-dom";

const MyMeals = () => {
  const { user, userMeals } = useContext(UserProgressContext);

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
