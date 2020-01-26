// WEATHER WEBSITE

const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast.js");
const geocode = require("./utils/geocode.js");

const app = express();

const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static direcotry to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
	res.render("index", {
		title: "Weather",
		name: "Stephen Peck"
	});
});

app.get("/weather", (req, res) => {
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

app.listen(port, () => {
	console.log("Server is up on port " + port + ".");
});
