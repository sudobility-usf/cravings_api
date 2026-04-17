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
    body: JSON.stringify({
      prompt: `Return a list of at least 10 to 15 restaurants serving ${dish} near ${location}. Do not stop at 5. For each include name, address, distance, and a 1-2 sentence summary of what the place is known for.`,
    }),
  });

  const rawBody = await response.text();
  console.log(`ShapeShyft response [${response.status}]:`, rawBody);

  if (!response.ok) {
    throw new Error(`ShapeShyft API error: ${response.status}`);
  }

  const data = JSON.parse(rawBody) as {
    success: boolean;
    data: { output: { restaurants: Restaurant[] }; usage: unknown };
  };
  return data.data.output.restaurants;
}
