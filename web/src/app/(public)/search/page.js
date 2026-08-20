import { Clock, PlayCircle } from "lucide-react";
import Link from "next/link";

async function getYoutubeData(id) {
  let title = "Video News";
  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      { next: { revalidate: 3600 } },
    );
    if (oembedRes.ok) {
      const oembedData = await oembedRes.json();
      title = oembedData.title;
    }
  } catch (err) {
    console.error("Error fetching YouTube data:", err);
  }
  return { id, title };
}

// Mock database for search
const MOCK_NEWS = [
  {
    id: 1,
    title: "प्रधानमन्त्री र मन्त्रीहरुको सम्पत्ति विवरण सार्वजनिक, कसको कति?",
    excerpt:
      "सरकारले प्रधानमन्त्री र मन्त्रीहरुको सम्पत्ति विवरण सार्वजनिक गरेको छ। मन्त्रिपरिषद बैठकको निर्णयअनुसार...",
    category: "राजनीति",
    date: "२ घण्टा अगाडि",
  },
  {
    id: 2,
    title: "सुनको मूल्यमा सामान्य गिरावट, कतिमा हुँदैछ कारोबार?",
    excerpt:
      "नेपाली बजारमा आज सुनको मूल्य सामान्य घटेको छ। नेपाल सुनचाँदी व्यवसायी महासंघका अनुसार...",
    category: "अर्थ/कृषि",
    date: "३ घण्टा अगाडि",
  },
  {
    id: 3,
    title: "काठमाडौं महानगरले सुरु गर्‍यो अवैध संरचना भत्काउन",
    excerpt:
      "काठमाडौं महानगरपालिकाले सडक मिचेर बनाइएका अवैध संरचना भत्काउन सुरु गरेको छ...",
    category: "समाज",
    date: "४ घण्टा अगाडि",
  },
  {
    id: 4,
    title: "बागमती प्रदेशमा नयाँ सरकार गठनको तयारी",
    excerpt:
      "बागमती प्रदेशमा नयाँ सरकार गठनका लागि दलहरुबीच छलफल तीव्र भएको छ...",
    category: "राजनीति",
    date: "५ घण्टा अगाडि",
  },
  {
    id: 5,
    title: "नयाँ प्रविधिको विकासले ल्याएको परिवर्तन र असर",
    excerpt:
      "प्रविधिको विकासले मानिसको दैनिकीमा ठूलो परिवर्तन ल्याएको छ। यसका सकारात्मक र नकारात्मक...",
    category: "सूचना प्रविधि",
    date: "१ दिन अगाडि",
  },
];

const VIDEO_IDS = [
  "rz3mMny174A",
  "gWnQQHcbRrM",
  "wt4Ah2KltpQ",
  "Cb9hhXQ_fKw",
  "tXW2xa5yf1s",
];

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || "";

  // Simple case-insensitive search logic for demo purposes
  const newsResults = query
    ? MOCK_NEWS.filter(
        (news) =>
          news.title.toLowerCase().includes(query.toLowerCase()) ||
          news.excerpt.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  let videoResults = [];
  if (query) {
    // Fetch titles for all videos
    const videos = await Promise.all(VIDEO_IDS.map((id) => getYoutubeData(id)));
    // Filter videos by query matching their titles
    videoResults = videos.filter((v) =>
      v.title.toLowerCase().includes(query.toLowerCase()),
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
                  
      <main className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {query ? (
            <>
              <span className="text-blue-600">&quot;{query}&quot;</span> को लागि
              खोज नतिजाहरू
            </>
          ) : (
            "खोज्नुहोस्"
          )}
        </h1>

        {!query ? (
          <p className="text-gray-500 text-lg py-10 text-center">
            कृपया खोज्नको लागि केहि शब्द टाइप गर्नुहोस्।
          </p>
        ) : newsResults.length > 0 || videoResults.length > 0 ? (
          <div className="flex flex-col gap-10">
            {newsResults.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  समाचार नतिजाहरू
                </h2>
                <div className="flex flex-col gap-6">
                  {newsResults.map((news) => (
                    <div
                      key={news.id}
                      className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> {news.date}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {news.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {news.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videoResults.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  भिडियो नतिजाहरू
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videoResults.map((video) => (
                    <div
                      key={video.id}
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col group"
                    >
                      <Link
                        href={`/videos/${video.id}`}
                        className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mb-3 shadow-sm ring-1 ring-gray-200 block group hover:opacity-95 transition-opacity"
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                          alt={video.title}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white group-hover:scale-110 transition-all drop-shadow-md" />
                        </div>
                      </Link>
                      <Link
                        href={`/videos/${video.id}`}
                        className="block"
                      >
                        <h3 className="font-bold text-[15px] text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {video.title}
                        </h3>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm text-center mt-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              कुनै नतिजा फेला परेन
            </h3>
            <p className="text-gray-500">
              तपाईंले खोज्नुभएको &quot;{query}&quot; सँग मेल खाने कुनै पनि
              समाचार वा भिडियो भेटिएन। कृपया अर्को शब्द प्रयास गर्नुहोस्।
            </p>
          </div>
        )}
      </main>

          </div>
  );
}
