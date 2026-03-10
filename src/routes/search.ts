import { Hono } from "hono";
import { successResponse, errorResponse } from "@sudobility/cravings_types";
import { searchRestaurants } from "../services/shapeshyft";
import type { Restaurant } from "../types/restaurant";

const searchRouter = new Hono();

/**
 * POST /search - Search for restaurants by location and dish.
 *
 * This is a **public** endpoint (no authentication required).
 * Proxies the request to the ShapeShyft API server-side.
 *
 * @body {{ location: string, dish: string }}
 * @returns {BaseResponse<Restaurant[]>} List of matching restaurants
 */
searchRouter.post("/search", async (c) => {
  const { location, dish } = await c.req.json<{ location: string; dish: string }>();

  if (!location || !dish) {
    return c.json(errorResponse("location and dish are required"), 400);
  }

  const restaurants = await searchRestaurants(location, dish);
  return c.json(successResponse<Restaurant[]>(restaurants));
});

export default searchRouter;
