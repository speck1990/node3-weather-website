const request = require("request");

const forecast = (latitude, longitude, callback) => {
	const url = "https://api.darksky.net/forecast/99542f65cf21fb66162981e38f03f655/" + latitude + "," + longitude;
	request({ url, json: true }, (error, { body } = {}) => {
		if (error) {
			callback("Unable to connect to weather service!", undefined);
		} else if (body.error) {
			callback("Unable to find location", undefined);
		} else {
			callback(undefined, body);
		}
	});
};

module.exports = forecast;
