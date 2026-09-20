import MenuContent from "./MenuContent";
import DishList from "./DishList";

export const revalidate = 60;

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const selectedCategory = params.category || "all";

  return (
    <MenuContent selectedCategory={selectedCategory}>
      <DishList selectedCategory={selectedCategory} />
    </MenuContent>
  );
}