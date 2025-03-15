import { NextRequest } from "next/server";

export async function GET(request: NextRequest, slug: { params: Promise<{ game_id: string }> }) {
    const game_id = (await slug.params).game_id;

    try {
        const response = await fetch(
            `https://games.roblox.com/v1/games?universeIds=${game_id}`,
            {
            next: {
                revalidate: 3600 * 24 * 7 * 2
            }
        });
        
        if (!response.ok) {
            return new Response(JSON.stringify({
                error: "Failed to fetch game info"
            }), {
                status: 500,
                headers: {
                    "Cache-Control": "no-cache, no-store"
                }
            });
        }
        
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            return new Response(JSON.stringify({
                error: "Game not found"
            }), {
                status: 404,
                headers: {
                    "Cache-Control": "public, max-age=86400, s-maxage=86400"
                }
            });
        }
        
        return new Response(JSON.stringify(data.data[0]), {
            headers: {
                "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=604800"
            }
        });
    } catch (error) {
        console.error(`Error fetching game info for universe ${game_id}:`, error);
    }

    return new Response(JSON.stringify({
        error: "Failed to fetch game info"
    }));
}