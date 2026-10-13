export default function PublicLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-pulse">
        {/* Top Ticker / Category bar skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-28 bg-gray-200 rounded-md"></div>
          <div className="h-4 flex-1 bg-gray-200/80 rounded-md hidden sm:block"></div>
        </div>

        {/* Hero Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <div className="aspect-16/9 w-full bg-gray-100 rounded-xl flex flex-col items-center justify-center border border-gray-200">
              <div className="w-8 h-8 rounded-full border-3 border-red-600 border-t-transparent animate-spin mb-2"></div>
              <span className="text-xs font-bold text-gray-500">ताजा सामग्री लोड हुँदैछ...</span>
            </div>
            <div className="h-4 w-24 bg-red-200 rounded"></div>
            <div className="h-7 w-4/5 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200/70 rounded"></div>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex gap-3 items-center"
              >
                <div className="w-20 h-16 bg-gray-200 rounded-lg shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-200/70 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-36 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
              >
                <div className="aspect-16/10 w-full bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200/70 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
