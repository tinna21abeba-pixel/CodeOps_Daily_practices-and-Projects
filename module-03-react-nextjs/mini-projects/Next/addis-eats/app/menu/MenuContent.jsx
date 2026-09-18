"use client";

import { useState } from "react";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

export default function MenuContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <>
      <h1 className="text-center text-orange-500  text-xl">Our Menu</h1>

      <CategoryBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <DishList selectedCategory={selectedCategory} />
    </>
  );
}