/**
 * @namespace com.uzi.interfaces.WeatherData
 */
export interface WeatherData {
	temperature: number;
	humidity: number;
	windSpeed: number;
	placeName?: string;
}
