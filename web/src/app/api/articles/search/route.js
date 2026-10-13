import { NextResponse } from "next/server";
import { searchArticles } from "@/lib/searchArticles";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || searchParams.get("search") || "";
    const type = searchParams.get("type") || "all";
    const category = searchParams.get("category") || "";
    const province = searchParams.get("province") || "";
    const status = searchParams.get("status") || "Published";
    const sort = searchParams.get("sort") || "latest";
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const limit = parseInt(searchParams.get("limit"), 10) || 20;

    const result = await searchArticles({
      q,
      type,
      category,
      province,
      status,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message, articles: [] },
      { status: 500 }
    );
  }
}
