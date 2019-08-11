const request = require("request");

const forecast = (latitude, longitude, callback) => {
	const url = "https://api.darksky.net/forecast/99542f65cf21fb66162981e38f03f655/" + latitude + "," + longitude;
	request({ url, json: true }, (error, { body } = {}) => {
		if (error) {
			callback("Unable to connect to weather service!", undefined);
		} else if (body.error) {
			callback("Unable to find location", undefined);
		} else {
			const text =
				body.daily.data[0].summary +
				" It is currently " +
				body.currently.temperature +
				" degrees out. There is a " +
				body.currently.precipProbability +
				"% chance of rain. Today's low is " +
				body.daily.data[0].temperatureLow +
				" degrees and the high is " +
				body.daily.data[0].temperatureHigh +
				" degrees.";
			callback(undefined, text);
		}
	});
};

module.exports = forecast;
