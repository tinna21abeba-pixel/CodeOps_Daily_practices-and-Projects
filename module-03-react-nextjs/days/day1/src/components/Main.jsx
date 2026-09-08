import React, { useState, useEffect } from "react";
import Dish from "./Dish";
import CategoryBar from "./CategoryBar";
import OrderForm from "./OrderForm";
import { useCartStore } from "../store/useCartStore";

const categories = ["All", "main", "side"];

function Main() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  );
  const totalPrice = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("/dishes.json")
      .then((res) => res.json())
      .then((data) => setDishes(data))
      .catch((err) => setError(err.message || "Failed to load dishes"))
      .finally(() => setLoading(false));
  }, []);

  const filteredMenu =
    selectedCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.catagory === selectedCategory);

  useEffect(() => {
    document.title = `${filteredMenu.length} Dishes - Taste of Habesha`;
  }, [filteredMenu.length]);

  function renderList() {
    if (loading) {
      return (
        <div className="status-container loading-state">
          <div className="spinner"></div>
          <p>Loading dishes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="status-container error-state">
          <p>⚠️ {error}</p>
        </div>
      );
    }

    return (
      <div className="menu-container">
        {filteredMenu.map((dish) => (
          <Dish
            key={dish.id}
            id={dish.id}
            name={dish.name}
            price={dish.price}
            catagory={dish.catagory}
            isSpicy={dish.isSpicy}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <main className="menu-container">
        <h3>Number of Selected Items:{totalItems}</h3>
        <h2>Total price: {totalPrice} ETB</h2>

        <CategoryBar
          categorys={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <p>Selected Category: {selectedCategory}</p>

        {renderList()}

        <OrderForm />
      </main>
    </>
  );
}

export default Main;