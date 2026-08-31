import express from "express";

const router = express.Router();

function parseYoutubeId(input) {
  if (!input) return "";
  const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : input.trim();
}

async function getYoutubeStats(videoId) {
  let title = "भिडियो समाचार (Video News)";
  let views = "";
  let date = "";

  // 1. Fetch title via YouTube oEmbed API
  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (oembedRes.ok) {
      const data = await oembedRes.json();
      if (data.title) title = data.title;
    }
  } catch (err) {}

  // 2. Fetch views & date from YouTube watch HTML
  try {
    const htmlRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (htmlRes.ok) {
      const html = await htmlRes.text();
      const match = html.match(/var ytInitialData = (.*);<\/script>/);
      if (match) {
        const data = JSON.parse(match[1]);
        const primaryInfo =
          data.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]
            ?.videoPrimaryInfoRenderer;

        if (primaryInfo) {
          const viewText =
            primaryInfo.viewCount?.videoViewCountRenderer?.viewCount?.simpleText ||
            primaryInfo.viewCount?.videoViewCountRenderer?.shortViewCount?.simpleText;
          if (viewText) views = viewText;

          const dateText = primaryInfo.dateText?.simpleText;
          if (dateText) date = dateText;
        }
      }
    }
  } catch (err) {}

  return { title, views, date };
}

router.get("/", async (req, res) => {
  try {
    const rawId = req.query.id || req.query.url;
    if (!rawId) {
      return res.status(400).json({ success: false, error: "YouTube ID or URL parameter is required" });
    }

    const videoId = parseYoutubeId(rawId);
    const { title, views, date } = await getYoutubeStats(videoId);

    const videoData = {
      id: videoId,
      videoId: videoId,
      title: title,
      views: views,
      date: date,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };

    return res.json({
      success: true,
      data: videoData,
      videoId,
      title,
      views,
      date,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
