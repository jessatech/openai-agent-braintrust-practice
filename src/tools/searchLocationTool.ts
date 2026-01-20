import { tool } from "@openai/agents";
import { z } from "zod";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

interface SearchLocation {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export const searchLocationTool = tool({
  name: "search_location",
  description:
    "Search for locations by name to get location details for weather queries. Returns matching cities and towns with their coordinates.",
  parameters: z.object({
    query: z
      .string()
      .describe(
        "Location name to search for (city name, postal code, zipcode, etc.)"
      ),
  }),
  execute: async (input) => {
    if (!WEATHER_API_KEY) {
      throw new Error(
        "WEATHER_API_KEY is not set in environment variables. Please add it to your .env file."
      );
    }

    const url = new URL(`${WEATHER_API_BASE_URL}/search.json`);
    url.searchParams.append("key", WEATHER_API_KEY);
    url.searchParams.append("q", input.query);

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `WeatherAPI error (${response.status}): ${errorText}`
        );
      }

      const locations: SearchLocation[] = await response.json();

      if (!locations || locations.length === 0) {
        return `No locations found for "${input.query}". Please try a different search term.`;
      }

      return JSON.stringify(
        locations.map((loc) => ({
          name: loc.name,
          region: loc.region,
          country: loc.country,
          lat: loc.lat,
          lon: loc.lon,
        })),
        null,
        2
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search for location: ${error.message}`);
      }
      throw new Error("Failed to search for location: Unknown error");
    }
  },
});
