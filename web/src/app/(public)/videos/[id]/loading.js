import { PlayCircle, Loader2 } from "lucide-react";

export default function VideoDetailLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Video Player Column */}
          <div className="lg:col-span-8 space-y-6 animate-pulse">
            {/* Video Player Container Skeleton */}
            <div className="w-full aspect-16/9 bg-gray-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-gray-500 shadow-md relative">
              <PlayCircle size={64} className="text-red-600/70 mb-2" />
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                <Loader2 size={16} className="animate-spin text-red-500" />
                <span>भिडियो लोड हुँदैछ...</span>
              </div>
            </div>

            {/* Video Title Skeleton */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="h-7 w-11/12 bg-gray-300 rounded-lg"></div>
              <div className="h-5 w-2/3 bg-gray-200 rounded-lg"></div>

              {/* Views & Date Bar Skeleton */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Suggestions Skeleton */}
          <div className="lg:col-span-4 space-y-4 animate-pulse">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="h-6 w-36 bg-gray-300 rounded"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-24 h-16 bg-gray-800 rounded-lg shrink-0 flex items-center justify-center text-gray-600">
                    <PlayCircle size={20} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
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
