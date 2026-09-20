"use client"

import CategoryBar from "./CategoryBar";
import dishes from "../data/Dishes";
import { useState } from "react";
export default function MenuLayout({ children }) {
    const [selectedCategory,setSelectedCategory]= useState("all");
  return (
  
  <div className="flex">
    <aside className="w-full md:w-1/2 lg:w-1/3">
      
     <CategoryBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      </aside>
        <main>{children}</main>
      </div>
  )
}
