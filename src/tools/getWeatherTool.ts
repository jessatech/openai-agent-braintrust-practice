import { tool } from "@openai/agents";
import { z } from "zod";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_dir: string;
  humidity: number;
  feelslike_c: number;
  feelslike_f: number;
  uv: number;
}

interface ForecastDay {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  condition: WeatherCondition;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  avghumidity: number;
  daily_chance_of_rain: number;
  daily_chance_of_snow: number;
  uv: number;
}

interface ForecastDayData {
  date: string;
  date_epoch: number;
  day: ForecastDay;
}

interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  localtime: string;
}

interface ForecastResponse {
  location: Location;
  current: CurrentWeather;
  forecast: {
    forecastday: ForecastDayData[];
  };
}

export const getWeatherTool = tool({
  name: "get_weather",
  description:
    "Get the current weather and forecast for a location. Use search_location first if you need to find the exact location name or coordinates.",
  parameters: z.object({
    location: z
      .string()
      .describe(
        "Location to get weather for (city name, postal code, latitude/longitude, etc.)"
      ),
    days: z
      .number()
      .min(1)
      .max(14)
      .default(3)
      .describe("Number of days of forecast (1-14, default: 3)"),
  }),
  execute: async (input) => {
    if (!WEATHER_API_KEY) {
      throw new Error(
        "WEATHER_API_KEY is not set in environment variables. Please add it to your .env file."
      );
    }

    const url = new URL(`${WEATHER_API_BASE_URL}/forecast.json`);
    url.searchParams.append("key", WEATHER_API_KEY);
    url.searchParams.append("q", input.location);
    url.searchParams.append("days", input.days.toString());
    url.searchParams.append("aqi", "no");
    url.searchParams.append("alerts", "no");

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `WeatherAPI error (${response.status}): ${errorText}`
        );
      }

      const data: ForecastResponse = await response.json();

      const result = {
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          localtime: data.location.localtime,
        },
        current: {
          temp_c: data.current.temp_c,
          temp_f: data.current.temp_f,
          condition: data.current.condition.text,
          humidity: data.current.humidity,
          wind_kph: data.current.wind_kph,
          wind_mph: data.current.wind_mph,
          wind_dir: data.current.wind_dir,
          feelslike_c: data.current.feelslike_c,
          feelslike_f: data.current.feelslike_f,
          uv: data.current.uv,
        },
        forecast: data.forecast.forecastday.map((day) => ({
          date: day.date,
          max_temp_c: day.day.maxtemp_c,
          max_temp_f: day.day.maxtemp_f,
          min_temp_c: day.day.mintemp_c,
          min_temp_f: day.day.mintemp_f,
          avg_temp_c: day.day.avgtemp_c,
          avg_temp_f: day.day.avgtemp_f,
          condition: day.day.condition.text,
          max_wind_kph: day.day.maxwind_kph,
          max_wind_mph: day.day.maxwind_mph,
          total_precip_mm: day.day.totalprecip_mm,
          total_precip_in: day.day.totalprecip_in,
          avg_humidity: day.day.avghumidity,
          chance_of_rain: day.day.daily_chance_of_rain,
          chance_of_snow: day.day.daily_chance_of_snow,
          uv: day.day.uv,
        })),
      };

      return JSON.stringify(result, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get weather: ${error.message}`);
      }
      throw new Error("Failed to get weather: Unknown error");
    }
  },
});
