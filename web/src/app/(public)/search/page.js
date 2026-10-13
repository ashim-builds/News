import { searchArticles } from "@/lib/searchArticles";
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const q = params?.q ? params.q.trim() : "";

  if (q) {
    return {
      title: `"${q}" को लागि खोज नतिजाहरू | स्मार्टसञ्चार`,
      description: `स्मार्टसञ्चारमा "${q}" सँग सम्बन्धित ताजा समाचार, लेख, भिडियो र विश्लेषणात्मक विवरणहरू।`,
    };
  }

  return {
    title: "खोज्नुहोस् | स्मार्टसञ्चार",
    description: "नेपालका ताजा र भरपर्दा समाचार, लेख, भिडियो र अन्य विषयहरू खोज्नुहोस्।",
  };
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q ? params.q.trim() : "";

  let articles = [];
  let counts = { all: 0, news: 0, videos: 0 };
  let recentArticles = [];

  if (query) {
    const searchRes = await searchArticles({
      q: query,
      limit: 80,
    });
    if (searchRes.success) {
      articles = searchRes.articles || [];
      counts = searchRes.counts || { all: articles.length, news: 0, videos: 0 };
    }
  } else {
    // If no query, fetch recent published stories to show recommendations
    const recentRes = await searchArticles({
      limit: 6,
      sort: "latest",
    });
    if (recentRes.success) {
      recentArticles = recentRes.articles || [];
    }
  }

  return (
    <SearchClient
      initialQuery={query}
      initialArticles={articles}
      initialCounts={counts}
      recentArticles={recentArticles}
    />
  );
}
