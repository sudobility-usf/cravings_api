import type { Restaurant } from "../types/restaurant";

const cache = new Map<string, Restaurant[]>();

export async function searchRestaurants(
  location: string,
  dish: string
): Promise<Restaurant[]> {
  const cacheKey = `${location.toLowerCase().trim()}|${dish.toLowerCase().trim()}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const baseUrl = process.env.SHAPESHYFT_BASE_URL;
  const apiKey = process.env.SHAPESHYFT_API_KEY;

  const response = await fetch(`${baseUrl}?api_key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `List 10 restaurants serving ${dish} near ${location}. JSON only, no explanation. Each: name, address, distance.`,
    }),
  });

  const rawBody = await response.text();

  if (!response.ok) {
    throw new Error(`ShapeShyft API error: ${response.status}`);
  }

  const data = JSON.parse(rawBody) as {
    success: boolean;
    data: { output: { restaurants: Restaurant[] }; usage: unknown };
  };
  const restaurants = data.data.output.restaurants;
  cache.set(cacheKey, restaurants);
  return restaurants;
}
