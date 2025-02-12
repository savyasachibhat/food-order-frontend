import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [meals, setMeals] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMeal, setEditMeal] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMeal(null);
    setErrorMessage(null); // Clear the error message when closing the modal
  };

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/meals`);
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
      setLoading(false);
    };

    fetchMeals();
  }, [backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      imageUrl: formData.get("imageUrl"),
      price: formData.get("price"),
    };

    try {
      const response = await fetch(`${backendUrl}/meals/add-meal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Meal added successfully");
        e.target.reset();
        handleClose(); // Close the modal
        setTimeout(() => {
          navigate("/admin"); // Navigate after a short delay to ensure modal closes first
        }, 100); // 100ms delay
      } else {
        const errorData = await response.json();
        console.error("Error adding meal:", errorData);
        setErrorMessage(errorData.message || "Error adding meal");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while adding the meal");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      imageUrl: formData.get("imageUrl"),
      price: formData.get("price"),
    };

    try {
      const response = await fetch(
        `${backendUrl}/meals/${editMeal._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        console.log("Meal updated successfully");
        e.target.reset();
        handleClose(); // Close the modal
        const updatedMeals = await (
          await fetch(`${backendUrl}/meals`)
        ).json();
        setMeals(updatedMeals);
      } else {
        console.error("Error updating meal");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meal?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${backendUrl}/meals/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMeals(meals.filter((meal) => meal._id !== id));
        console.log("Meal deleted successfully");
      } else {
        console.error("Error deleting meal");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="meals-container">
        <h1>Meals List</h1>
        <button onClick={handleOpen}>Add meals</button>
        {loading && <p>Loading...</p>}
        <ul className="meals-grid">
          {meals.map((meal) => (
            <li key={meal._id} className="meal-item">
              <img src={meal.image} alt="image of food" />
              <h2>{meal.name}</h2>
              <p>Price: ₹ {meal.price}</p>
              <button
                onClick={() => {
                  setEditMeal(meal);
                  handleOpen();
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(meal._id)}>delete</button>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div className="modal-backdrop" onClick={handleClose}>
          <dialog open className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editMeal ? "Edit Meal" : "Add Meal"}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form
              className="login-form"
              onSubmit={editMeal ? handleEditSubmit : handleSubmit}
            >
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={editMeal ? editMeal.name : ""}
                required
              />
              <label htmlFor="imageUrl">Image URL:</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                defaultValue={editMeal ? editMeal.image : ""}
                required
              />
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                name="price"
                defaultValue={editMeal ? editMeal.price : ""}
                required
              />
              <button type="submit">
                {editMeal ? "Save Changes" : "Add Meal"}
              </button>
            </form>
          </dialog>
        </div>
      )}
    </>
  );
};

export default Admin;
