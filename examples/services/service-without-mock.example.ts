/**
 * Service Example - Without Mock API (Direct to Real API)
 *
 * Use this pattern for:
 * - Apps that always connect to real API
 * - Third-party API integrations
 * - Production-only features
 * - When mock API is not needed
 *
 * Features:
 * - Direct API connection
 * - No mock/real switching
 * - Full CRUD operations
 * - Type-safe with TypeScript
 * - Error handling
 */

import { api } from '@/services/api';

// Type definitions
export interface Weather {
  id: string;
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  pressure: number;
  updatedAt: string;
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
}

/**
 * Weather Service
 *
 * Direct connection to weather API - no mock API support
 * This is useful for:
 * - Third-party API integrations
 * - Services that don't need mock data
 * - Real-time data that can't be mocked effectively
 */
class WeatherService {
  /**
   * Get current weather by city name
   */
  async getCurrentWeather(city: string, country?: string): Promise<Weather> {
    const params: any = { city };
    if (country) params.country = country;

    return await api.get<Weather>('/weather/current', params);
  }

  /**
   * Get weather by coordinates
   */
  async getWeatherByCoordinates(lat: number, lon: number): Promise<Weather> {
    return await api.get<Weather>('/weather/coordinates', { lat, lon });
  }

  /**
   * Get 7-day weather forecast
   */
  async getWeeklyForecast(city: string): Promise<WeatherForecast[]> {
    return await api.get<WeatherForecast[]>('/weather/forecast', { city, days: 7 });
  }

  /**
   * Get weather for multiple cities
   */
  async getMultipleCities(cities: string[]): Promise<Weather[]> {
    return await api.post<Weather[]>('/weather/multiple', { cities });
  }

  /**
   * Search cities by name
   */
  async searchCities(query: string): Promise<Array<{ name: string; country: string }>> {
    return await api.get('/weather/cities/search', { q: query });
  }
}

// Export singleton instance
export const weatherService = new WeatherService();

/**
 * Usage Examples:
 *
 * 1. Get current weather:
 *    const weather = await weatherService.getCurrentWeather('Jakarta', 'ID');
 *
 * 2. Get weather by GPS coordinates:
 *    const weather = await weatherService.getWeatherByCoordinates(-6.2088, 106.8456);
 *
 * 3. Get weekly forecast:
 *    const forecast = await weatherService.getWeeklyForecast('Jakarta');
 *
 * 4. Get multiple cities:
 *    const cities = await weatherService.getMultipleCities(['Jakarta', 'Bandung', 'Surabaya']);
 *
 * 5. Search cities:
 *    const results = await weatherService.searchCities('Jak');
 */

/**
 * Note: When using this service, make sure:
 * 1. API endpoint is configured in src/utils/constants.ts
 * 2. API key (if required) is set in environment variables
 * 3. Network connectivity is available
 * 4. Error handling is implemented in UI components
 */
