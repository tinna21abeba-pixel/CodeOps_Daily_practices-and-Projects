"use client";

export default function Error({ reset }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto my-8">
      <h2 className="text-base font-bold text-red-700 mb-2">
        Sorry, there was an error loading the menu.
      </h2>
      <p className="text-xs text-red-600 mb-4">Please try again later.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        Try Again
      </button>
    </div>
  );
}