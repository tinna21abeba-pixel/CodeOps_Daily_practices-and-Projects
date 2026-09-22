"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">
        Something went wrong!
      </h2>
      <p className="text-zinc-400 mb-6 text-sm">
        {error?.message || "Failed to load menu content."}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold text-sm transition"
      >
        Try again
      </button>
    </div>
  );
}