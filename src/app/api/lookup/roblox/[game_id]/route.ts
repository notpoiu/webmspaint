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
            throw new Error(`Failed to fetch game info: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            return null;
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