import { useContext } from "react";
import UserProgressContext from "../store/UserProgressContext";

const MyMeals = () => {
  const { user, userMeals } = useContext(UserProgressContext);

  return (
    <div>
      <h2>{user ? `${user.name}'s Ordered Meals` : "My Meals"}</h2>
      {userMeals.length === 0 ? <p>No meals found.</p> : (
        <ul>
          {userMeals.map((meal, index) => (
            <li key={index}>
              <strong>{meal.name}</strong> - {meal.quantity} x ₹{meal.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyMeals;
