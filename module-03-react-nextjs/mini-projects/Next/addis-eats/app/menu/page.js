import MenuContent from "./MenuContent";

export default async function MenuPage() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return <MenuContent />;
}