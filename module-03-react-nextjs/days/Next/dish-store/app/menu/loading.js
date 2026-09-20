export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-lg font-bold text-stone-800">Loading Menu...</h2>
      <p className="text-sm text-stone-500 mt-1">
        Please wait while we prepare the menu.
      </p>
    </div>
  );
}