import React, { useState, useEffect } from "react";
import Dish from "./Dish";
import CategoryBar from "./CategoryBar";
import OrderForm from "./OrderForm";

const categories = ["All", "main", "side"];

function Main() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // 2 & 3. Fetch dishes in useEffect with empty dependency array, loading & error state
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("/dishes.json")
      .then((res) => res.json())
      .then((data) => setDishes(data))
      .catch((err) => setError(err.message || "Failed to load dishes"))
      .finally(() => setLoading(false));
  }, []);

  function handleAdd(price) {
    setTotalPrice((prevTotal) => prevTotal + price);
  }
  function handleTotalItems() {
    setTotalItems((prev) => prev + 1);
  }

  const filteredMenu =
    selectedCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.catagory === selectedCategory);

  // 1. Set document.title to the number of dishes currently shown, updating whenever the list changes
  useEffect(() => {
    document.title = `${filteredMenu.length} Dishes - Taste of Habesha`;
  }, [filteredMenu.length]);

  // 3. Render loading and error states with early returns before the list
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
            name={dish.name}
            price={dish.price}
            catagory={dish.catagory}
            isSpicy={dish.isSpicy}
            onAdd={handleAdd}
            onItem={handleTotalItems}
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