const express = require("express");
const router = express.Router();

const forecast = require("../utils/forecast");
const geocode = require("../utils/geocode");

router.get("", (req, res) => {
	res.render("index", {
		title: "Weather",
		name: "Stephen Peck"
	});
});

router.get("/weather", (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: "You must provide an address!"
		});
	}

	geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
		if (error) {
			return res.send({
				error: error
			});
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({
					error: error
				});
			}

			res.send({
				forecast: forecastData,
				location,
				address: req.query.address
			});
		});
	});
});

module.exports = router;
