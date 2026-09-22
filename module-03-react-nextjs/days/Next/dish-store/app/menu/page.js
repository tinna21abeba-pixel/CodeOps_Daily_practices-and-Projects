import dishesData from "../data/Dishes";
import FilterShell from "./FilterShell";
import DishList from "./DishList";

export const revalidate = 60;

async function getDishes() {
  return dishesData;
}

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const selectedCategory = params?.category || "all";
  const dishes = await getDishes();

  return (
    <FilterShell selectedCategory={selectedCategory}>
      <DishList dishes={dishes} selectedCategory={selectedCategory} />
    </FilterShell>
  );
}