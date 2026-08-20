import { NextResponse } from "next/server";

function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  
  // If it's just an 11-character ID without spaces/special chars, return it
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }

  // Otherwise try to match standard YouTube URL formats
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = urlOrId.match(regex);
  return match ? match[1] : null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoInput = searchParams.get("id");
    
    if (!videoInput) {
      return NextResponse.json({ success: false, message: "Video ID or URL is required" }, { status: 400 });
    }

    const videoId = extractYouTubeId(videoInput);
    
    if (!videoId) {
      return NextResponse.json({ success: false, message: "Invalid YouTube URL or ID" }, { status: 400 });
    }

    let title = "Video News";
    let views = "N/A";
    let date = "N/A";

    // 1. Fetch title from OEmbed API
    try {
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        title = oembedData.title;
      }
    } catch (e) {
      console.error("Error fetching oembed:", e);
    }

    // 2. Fetch views and date from HTML parsing (ytInitialData)
    try {
      const htmlRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: { "Accept-Language": "en-US,en;q=0.9" }
      });
      if (htmlRes.ok) {
        const html = await htmlRes.text();
        const match = html.match(/var ytInitialData = (.*);<\/script>/);
        if (match) {
          const data = JSON.parse(match[1]);
          const videoDetails = data.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer;
          
          if (videoDetails?.viewCount?.videoViewCountRenderer?.viewCount?.simpleText) {
            views = videoDetails.viewCount.videoViewCountRenderer.viewCount.simpleText;
          } else if (videoDetails?.viewCount?.videoViewCountRenderer?.shortViewCount?.simpleText) {
            views = videoDetails.viewCount.videoViewCountRenderer.shortViewCount.simpleText;
          }
          
          if (videoDetails?.dateText?.simpleText) {
            date = videoDetails.dateText.simpleText;
          }
        }
      }
    } catch (e) {
      console.error("Error fetching HTML data:", e);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: videoId,
        title,
        views,
        date
      }
    });

  } catch (error) {
    console.error("[YOUTUBE API ERROR]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch YouTube details" }, { status: 500 });
  }
}
