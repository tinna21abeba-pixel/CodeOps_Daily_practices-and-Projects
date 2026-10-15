import books from "../../data/Dishes";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SinglePage({ params }) {
  const { id } = await params;
  const book = books.find((book) => book.id == id);
  if (!book) {
    notFound();
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm mb-4">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          {book.title || book.name}
        </h1>
        {book.author && (
          <p className="text-stone-600 text-sm mb-2">{book.author}</p>
        )}
        <p className="text-lg font-bold text-orange-600 mb-2">
          {book.price} ETB
        </p>
        {book.description && (
          <p className="text-stone-500 text-sm">{book.description}</p>
        )}
      </div>

      <Link
        href="/menu"
        className="min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        Back to Menu
      </Link>
    </div>
  );
}