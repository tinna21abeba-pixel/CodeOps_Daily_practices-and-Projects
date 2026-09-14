import React, { useState, useEffect, useCallback, useMemo } from "react";
import Dish from "./Dish";
import CategoryBar from "./CategoryBar";
import { useCartStore } from "../store/useCartStore";

const categories = ["All", "main", "side"];

const initialDishes = [
  { id: 1, name: "Doro Wet", price: 250, catagory: "main", isSpicy: true },
  { id: 2, name: "Kitfo", price: 350, catagory: "main", isSpicy: true },
  { id: 3, name: "Shiro", price: 150, catagory: "side", isSpicy: false },
  { id: 4, name: "Injera", price: 50, catagory: "side", isSpicy: false },
  { id: 5, name: "Ayib", price: 100, catagory: "side", isSpicy: false },
  { id: 6, name: "Gomen", price: 100, catagory: "side", isSpicy: false },
  { id: 7, name: "Tibs", price: 300, catagory: "main", isSpicy: true },
  { id: 8, name: "Beyainetu", price: 250, catagory: "main", isSpicy: false }
];

function Menu({ onOpenDishModal, crashedDishId, onTriggerCrash }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dishes, setDishes] = useState(initialDishes);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    let isMounted = true;
    fetch("/dishes.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dishes data");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setDishes(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = useCallback(
    (dish) => {
      addItem(dish);
    },
    [addItem]
  );

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesCategory =
        selectedCategory === "All" || dish.catagory === selectedCategory;
      const matchesSearch = dish.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [dishes, selectedCategory, searchQuery]);

  return (
    <div className="menu-section">
      <div className="menu-controls-header">
        <div className="menu-filter-row">
          <CategoryBar
            categorys={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <div className="search-bar-wrap">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search dishes"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="status-container error-state">
          <p>⚠️ {error}</p>
        </div>
      )}

      <div className="dish-grid">
        {filteredDishes.length === 0 ? (
          <div className="status-container empty-state">
            <p>No dishes match your filter criteria.</p>
          </div>
        ) : (
          filteredDishes.map((dish) => (
            <Dish
              key={dish.id}
              dish={dish}
              onAddToCart={handleAddToCart}
              onOpenDetails={onOpenDishModal}
              shouldCrash={crashedDishId === dish.id}
              onTriggerCrash={onTriggerCrash}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Menu;
