import { MapPin } from "lucide-react";

export default function ProvinceLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
        <div className="flex items-center gap-2 border-b-2 border-red-600 pb-3">
          <MapPin size={24} className="text-red-600" />
          <div className="h-8 w-48 bg-gray-300 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xs space-y-3 p-4"
            >
              <div className="aspect-16/10 bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-3 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
