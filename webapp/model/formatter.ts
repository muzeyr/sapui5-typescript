export default class Formatter {
	static formatValue(value: string): string {
		return value?.toUpperCase() ?? "";
	}

	formatWindDirectionBackground(windDirection: number) {
		console.log(windDirection);
		return windDirection < 10 ? "yellowBackground" : "lightGreenBackground";
	}
	formatDisplayName(displayName: string) {
		if (displayName && displayName.length > 15) {
			return displayName.substring(0, 15) + "...";
		}
		return displayName;
	}
}
