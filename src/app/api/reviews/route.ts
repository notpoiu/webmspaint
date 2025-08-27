import { NextResponse } from "next/server";

type Review = {
  name: string;
  username: string;
  body: string;
  img: string;
  stars: number;
};

// Cache the aggregated reviews for 14 days
const revalidate = 60 * 60 * 24 * 14; /**
 * GET handler that aggregates review entries from the assets GitHub repository and returns them with an average rating.
 *
 * Fetches the repository directory listing at `assets/contents/reviews`, then loads each directory's `data.json`
 * from the raw GitHub CDN. Filters out entries where `data.banned === true`, maps fields into local `Review` objects
 * (name, username, body, img, stars), and computes the average star rating. Uses an optional GitHub token from
 * environment variables (`GITHUB_TOKEN` or `GITHUB_PERSONAL_ACCESS_TOKEN`) to increase API rate limits when available.
 *
 * Behavior and error handling:
 * - If listing the reviews fails, returns `{ reviews: [], average: 0, error: "GitHub list error: <status>", limited }`
 *   with status 429 when GitHub indicates a rate limit, otherwise the listing status. Short cache headers are set
 *   to reduce pressure during rate limits.
 * - Per-review fetch failures are handled per-item using Promise.allSettled; individual failures do not abort the whole
 *   aggregation. Banned or missing entries are omitted.
 * - On unexpected errors, returns `{ reviews: [], average: 0, error: "Unexpected error" }` with status 500.
 *
 * Caching:
 * - Successful responses are returned with long-lived edge caching (s-maxage=1209600, stale-while-revalidate=2592000).
 * - Error responses use short caching to mitigate rate-limit effects.
 *
 * @returns A NextResponse JSON payload containing:
 * - `reviews`: an array of Review objects { name, username, body, img, stars }.
 * - `average`: number — the arithmetic mean of review `stars` (0 if no reviews).
 * - On error, additional fields `error` (string) and, for GitHub-list failures, `limited` (boolean) may be present.
 */

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
