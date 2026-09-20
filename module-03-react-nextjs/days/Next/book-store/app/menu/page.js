"use client";

import { useState } from "react";
import Link from "next/link";

import dishes from "../data/Dishes";

import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  return (
    <main>
      <h1>Habesha Restaurant</h1>

      <Link href="/">
        Home
      </Link>

      <CategoryBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <DishList
        selectedCategory={selectedCategory}
      />
    </main>
  );
}