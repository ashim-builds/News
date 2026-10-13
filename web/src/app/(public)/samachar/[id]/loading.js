export default function NewsDetailLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Breadcrumb Skeleton */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
            <div className="h-4 w-3 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-3 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
          <div className="h-7 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200 animate-pulse">
            {/* Category / Province Badge */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 bg-red-200 rounded-md"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <div className="h-8 w-11/12 bg-gray-300 rounded-lg"></div>
              <div className="h-8 w-3/4 bg-gray-300 rounded-lg"></div>
            </div>

            {/* Author & Timestamp Bar */}
            <div className="flex items-center justify-between py-3 border-y border-gray-100">
              <div className="flex items-center gap-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>

            {/* Main Featured Image Skeleton */}
            <div className="w-full aspect-16/9 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-gray-300 border-t-transparent animate-spin"></div>
            </div>

            {/* Paragraph lines skeleton */}
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6 animate-pulse">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-20 h-16 bg-gray-200 rounded-lg shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
