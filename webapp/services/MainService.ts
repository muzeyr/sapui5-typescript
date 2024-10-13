/** @namespace com.uzi.services */

import { WeatherData } from "../interfaces/WeatherData";

/** @namespace com.uzi.services */

export class MainService {
	private static readonly BASE_URL = "https://api.open-meteo.com/v1";
	private static readonly NOMINATIM_URL =
		"https://nominatim.openstreetmap.org/search";

	static async getWeatherData(location: string): Promise<WeatherData> {
		try {
			// Önce konumu koordinatlara çevirelim
			const geoData = await this.geocodeLocation(location);
			if (!geoData) {
				throw new Error("Location not found");
			}

			// Şimdi hava durumu verilerini alalım
			const weatherData = await this.fetchWeatherData(
				geoData.lat,
				geoData.lon,
				geoData.display_name
			);

			return weatherData;
		} catch (error) {
			console.error("Error in getWeatherData:", error);
			throw error;
		}
	}

	public static async geocodeLocation(location: string): Promise<any> {
		const url = `${this.NOMINATIM_URL}?q=${encodeURIComponent(
			location
		)}&format=json`;
		const response = await fetch(url);
		const data = await response.json();

		if (data && data.length > 0) {
			return data;
		}
		return null;
	}

	public static async fetchWeatherData(
		lat: string,
		lon: string,
		placeName: string
	): Promise<WeatherData> {
		const url = `${this.BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
		const response = await fetch(url);
		const jsonData = (await response.json()) as WeatherData;
		jsonData.placeName = placeName;
		return jsonData;
	}
}
