import type { Restaurant } from "../types/restaurant";

export async function searchRestaurants(
  location: string,
  dish: string
): Promise<Restaurant[]> {
  const baseUrl = process.env.SHAPESHYFT_BASE_URL;
  const apiKey = process.env.SHAPESHYFT_API_KEY;

  const response = await fetch(`${baseUrl}?api_key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ location, dish }),
  });

  const rawBody = await response.text();
  console.log(`ShapeShyft response [${response.status}]:`, rawBody);

  if (!response.ok) {
    throw new Error(`ShapeShyft API error: ${response.status}`);
  }

  const data = JSON.parse(rawBody) as { success: boolean; data: { output: Restaurant; usage: unknown } };
  return [data.data.output];
}
