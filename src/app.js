const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast.js");
const geocode = require("./utils/geocode.js");

const app = express();

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

app.get("/about", (req, res) => {
	res.render("about", {
		title: "About Me",
		name: "Stephen Peck"
	});
});

app.get("/help", (req, res) => {
	res.render("help", {
		title: "Help",
		name: "Stephen Peck",
		helpText: "This is some helpful message"
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

app.get("/products", (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: "You must a provide a search term"
		});
	}
	console.log(req.query.search);
	res.send({
		products: []
	});
});

app.get("/help/*", (req, res) => {
	res.render("404", {
		title: "404",
		name: "Stephen Peck",
		errorMessage: "Help article not found."
	});
});

app.get("*", function(req, res) {
	res.render("404", {
		title: "404",
		name: "Stephen Peck",
		errorMessage: "Page not found"
	});
});

app.listen(3000, () => {
	console.log("Server is up on port 3000.");
});
