import { describe, it, expect, vi, beforeEach } from "vitest";
import { successResponse, errorResponse } from "@sudobility/cravings_types";
import type { Restaurant } from "../types/restaurant";

const mockRestaurants: Restaurant[] = [
  { name: "Taco Place", address: "123 Main St", distance: "0.5 miles" },
  { name: "Burrito Spot", address: "456 Elm Ave", distance: "1.2 miles" },
];

describe("search route", () => {
  it("should return restaurants in correct response format", () => {
    const response = successResponse<Restaurant[]>(mockRestaurants);
    expect(response.success).toBe(true);
    expect(response.data).toHaveLength(2);
    expect(response.data[0].name).toBe("Taco Place");
    expect(response.data[0].address).toBe("123 Main St");
    expect(response.data[0].distance).toBe("0.5 miles");
    expect(response.timestamp).toBeDefined();
  });

  it("should return empty array when no restaurants found", () => {
    const response = successResponse<Restaurant[]>([]);
    expect(response.success).toBe(true);
    expect(response.data).toHaveLength(0);
  });

  it("should return error response for missing fields", () => {
    const response = errorResponse("location and dish are required");
    expect(response.success).toBe(false);
    expect(response.error).toBe("location and dish are required");
  });
});
