export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-pulse text-white">
      <div className="pb-4 border-b border-zinc-800 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-zinc-800 rounded-lg"></div>
          <div className="h-4 w-96 bg-zinc-800/60 rounded"></div>
        </div>
        <div className="h-9 w-32 bg-zinc-800 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3">
            <div className="h-3 w-24 bg-zinc-800 rounded"></div>
            <div className="h-6 w-32 bg-zinc-800 rounded"></div>
            <div className="h-3 w-28 bg-zinc-800/50 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="h-5 w-48 bg-zinc-800 rounded"></div>
          <div style={{ height: "320px" }} className="w-full bg-zinc-950/70 rounded-xl"></div>
          <div className="h-32 w-full bg-zinc-950/40 rounded-xl"></div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="h-5 w-48 bg-zinc-800 rounded"></div>
          <div style={{ height: "320px" }} className="w-full bg-zinc-950/70 rounded-xl"></div>
          <div className="h-32 w-full bg-zinc-950/40 rounded-xl"></div>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
        <div className="h-5 w-52 bg-zinc-800 rounded"></div>
        <div className="h-64 w-full bg-zinc-950/60 rounded-xl"></div>
      </div>
    </div>
  );
}
