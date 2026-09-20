import NavBar from "./NavBar";

export default function Header() {
  return (
    <header className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-orange-600 tracking-tight">Addis Eats</h1>
        <NavBar />
      </div>
    </header>
  );
}