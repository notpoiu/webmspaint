"use server";

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

export async function getGameInfo(universeId: number): Promise<RobloxGameResponse["data"][0] | null> {
  try {
    const response = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`,
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
    
    return data.data[0];
  } catch (error) {
    console.error(`Error fetching game info for universe ${universeId}:`, error);
    return null;
  }
};