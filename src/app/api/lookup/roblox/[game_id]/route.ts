import { NextRequest, NextResponse } from "next/server";

export interface RobloxGameResponse {
    data: {
      id: number;
      rootPlaceId: number;
      name: string;
      description: string;
      sourceName?: string;
      sourceDescription?: string;
      creator: {
        id: number;
        name: string;
        type: string;
      };
      price?: number;
      allowedGearGenres: string[];
      allowedGearCategories: string[];
      isGenreEnforced: boolean;
      copying: boolean;
      playing: number;
      visits: number;
      maxPlayers: number;
      created: string;
      updated: string;
      studioAccessToApisAllowed: boolean;
      createVipServersAllowed: boolean;
      universeAvatarType: string;
      genre: string;
      isAllGenre: boolean;
      isFavoritedByUser: boolean;
      favoritedCount: number;
    }[];
}
  

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
        
        const data = await response.json() as RobloxGameResponse;
        
        if (!data.data || data.data.length === 0) {
            return null;
        }
        
        return NextResponse.json(data.data[0]);
    } catch (error) {
        console.error(`Error fetching game info for universe ${game_id}:`, error);
        return NextResponse.json({
            error: "Failed to fetch game info"
        });
    }
}