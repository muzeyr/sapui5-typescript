import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import { MainService } from "../services/MainService";
import MessageToast from "sap/m/MessageToast";
import Formatter from "../model/formatter";

/**
 * @namespace com.uzi.controller
 */
export default class Main extends BaseController {
	private formatter: Formatter = new Formatter();
	onInit(): void {
		const oModel = new JSONModel({
			location: "",
		});
		this.getView().setModel(oModel);
	}

	formatDisplayName(displayName: string) {
		if (displayName && displayName.length > 13) {
			return displayName.substring(0, 13) + "...";
		}
		return displayName;
	}
	public formatWindDirectionBackground(): string {
		const random = Math.round(Math.random());
		return random === 0 ? "lightGreenBackground" : "yellowBackground";
	}

	private async loadWeatherData() {
		const oModel = this.getView().getModel();
		const aLocations = oModel.getProperty("/locations") as any[];

		for (let i = 0; i < aLocations.length; i++) {
			const location = aLocations[i];
			try {
				const weatherData = await MainService.fetchWeatherData(
					location.lat,
					location.lon,
					location.display_name
				);
				oModel.setProperty(`/locations/${i}/temperature`, weatherData);
			} catch (error) {
				console.error(
					`Error fetching weather data for ${location.display_name}:`,
					error
				);
				// Hata durumunda sıcaklığı null olarak ayarla
				oModel.setProperty(`/locations/${i}/temperature`, null);
			}
		}
	}
	async onInputLocationChange(): Promise<void> {
		const oModel = this.getView().getModel() as JSONModel;
		const location = oModel.getProperty("/location") as string;

		const oResourceBundle = this.getResourceBundle();

		if (!location || location.trim() === "") {
			MessageToast.show(oResourceBundle.getText("enterCityName"));
			return;
		}

		// Geçersiz karakterler kontrolü (örnek olarak sadece harf ve boşluk kabul ediliyor)
		if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(location)) {
			MessageToast.show(oResourceBundle.getText("invalidCityName"));
			return;
		}

		try {
			const results = await MainService.geocodeLocation(location);

			if (results.length > 0) {
				const oModel = new JSONModel({
					locations: results,
				});
				this.getView().setModel(oModel);
				await this.loadWeatherData();
			} else {
				MessageBox.alert(`Location ${location} not found`, {
					actions: MessageBox.Action.CLOSE,
				});
			}
		} catch (error) {
			console.error("Error in location search or weather data loading:", error);
			MessageBox.error("An error occurred while processing your request.");
		}
	}
}
