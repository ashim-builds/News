import { PlayCircle } from "lucide-react";

export default function VideosGalleryLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
        {/* Header Title Skeleton */}
        <div className="flex items-center justify-between border-b-2 border-red-600 pb-3">
          <div className="h-8 w-48 bg-gray-300 rounded-lg"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Video Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs space-y-3"
            >
              <div className="aspect-16/9 bg-gray-800 flex items-center justify-center text-gray-600">
                <PlayCircle size={36} />
              </div>
              <div className="p-4 space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
