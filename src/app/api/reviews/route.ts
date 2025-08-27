import { NextResponse } from "next/server";

type Review = {
  name: string;
  username: string;
  body: string;
  img: string;
  stars: number;
};

// Cache the aggregated reviews for 14 days
const revalidate = 60 * 60 * 24 * 14; // seconds (2 weeks)

export async function GET() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  // Optional: use a token if provided to increase rate limits
  const token =
    process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const listRes = await fetch(
      "https://api.github.com/repos/mspaint-cc/assets/contents/reviews",
      {
        headers,
        // Use Next fetch caching on the server
        next: { revalidate },
      }
    );

    if (!listRes.ok) {
      let limited = false;
      try {
        const err = await listRes.json();
        limited =
          listRes.status === 403 &&
          typeof err?.message === "string" &&
          err.message.toLowerCase().includes("rate limit");
      } catch {
        // ignore
      }
      return NextResponse.json(
        {
          reviews: [],
          average: 0,
          error: `GitHub list error: ${listRes.status}`,
          limited,
        },
        {
          status: limited ? 429 : listRes.status,
          headers: {
            // Cache errors briefly to shield rate limits
            "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
          },
        }
      );
    }

    const items: { type: string; path: string }[] = await listRes.json();
    const dirs = items.filter((i) => i.type === "dir");

    // Fetch each review's data.json using allSettled; rely on GitHub CDN caching
    const settled = await Promise.allSettled(
      dirs.map(async (dir) => {
        const base = `https://raw.githubusercontent.com/mspaint-cc/assets/main/${dir.path}/`;
        const res = await fetch(base + "data.json", {
          cache: "force-cache",
          next: { revalidate },
        });
        if (!res.ok) {
          // Treat 403 specially (likely rate-limited or forbidden)
          if (res.status === 403) {
            throw new Error("rate_limited_or_forbidden");
          }
          throw new Error(`bad_status_${res.status}`);
        }
        const data = await res.json();
        if (data && data.banned !== true) {
          const review: Review = {
            name: data.name,
            username: data.username,
            body: data.content,
            img: base + "pfp.png",
            stars: data.stars,
          };
          return review;
        }
        return null; // filtered/banned
      })
    );

    const reviews: Review[] = settled.reduce<Review[]>((acc, r) => {
      if (r.status === "fulfilled" && r.value) {
        acc.push(r.value as Review);
      }
      return acc;
    }, []);
    const total = reviews.reduce((sum, r) => sum + (r.stars || 0), 0);
    const average = reviews.length ? total / reviews.length : 0;

    return NextResponse.json(
      { reviews, average },
      {
        headers: {
          // Cache at the edge for 14 days; allow long SWR for resilience
          "Cache-Control": "s-maxage=1209600, stale-while-revalidate=2592000",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { reviews: [], average: 0, error: "Unexpected error" },
      {
        status: 500,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  }
}
