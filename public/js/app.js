const weatherForm = document.querySelector("form");
const search = document.querySelector("input#location");
const currentLocation = document.querySelector("button#button-current");
const messageOne = document.querySelector("#message-1");
const weatherDetails = document.querySelector("#weather-details");

const currentIcon = document.querySelector("#current-icon");
const currentTemperature = document.querySelector("#current-temperature");
const currentState = document.querySelector("#current-state");
const apparentTemperature = document.querySelector("#apparent-temperature");
const lowTemperature = document.querySelector("#low-temperature");
const highTemperature = document.querySelector("#high-temperature");

messageOne.textContent = "";

currentLocation.addEventListener("click", e => {
	if (!navigator.geolocation) {
		// no geolocation
	} else {
		navigator.geolocation.getCurrentPosition(
			position => {
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;

				search.value = latitude + ", " + longitude;
			},
			error => {
				console.log(error);
			}
		);
	}
});

weatherForm.addEventListener("submit", e => {
	e.preventDefault();

	const location = encodeURIComponent(search.value);

	messageOne.textContent = "Loading...";

	fetch("/weather?address=" + location).then(response => {
		response.json().then(data => {
			if (data.error) {
				messageOne.textContent = data.error;
			} else {
				const weatherIcons = {
					"clear-day": '<i class="fas fa-sun"></i>',
					"clear-night": '<i class="fas fa-moon"></i>',
					rain: '<i class="fas fa-cloud-rain"></i>',
					snow: '<i class="fas fa-snowflake"></i>',
					sleet: '<i class="fas fa-cloud-meatball"></i>',
					wind: '<i class="fas fa-wind"></i>',
					fog: '<i class="fas fa-smog"></i>',
					cloudy: '<i class="fas fa-cloud"></i>',
					"partly-cloudy-day": '<i class="fas fa-cloud-sun"></i>',
					"partly-cloudy-night": '<i class="fas fa-cloud-moon"></i>'
				};

				currentIcon.innerHTML = weatherIcons[data.forecast.currently.icon];
				currentTemperature.textContent = Math.round(data.forecast.currently.temperature);
				currentState.textContent = data.forecast.currently.summary;
				apparentTemperature.textContent = Math.round(data.forecast.currently.apparentTemperature);
				lowTemperature.textContent = Math.floor(data.forecast.daily.data[0].temperatureLow);
				highTemperature.textContent = Math.round(data.forecast.daily.data[0].temperatureHigh);
				messageOne.textContent = "";

				weatherDetails.classList.remove("invisible");
			}
		});
	});
});
