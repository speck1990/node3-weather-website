const weatherForm = document.querySelector("form");
const search = document.querySelector("input#location");
const currentLocation = document.querySelector("button#button-current");
const messageOne = document.querySelector("#message-1");
const weatherDetails = document.querySelector("#weather-details");
const forecastTable = document.querySelector("#forecastTable");
const hourlyBtn = document.querySelector("#hourlyBtn");
const dailyBtn = document.querySelector("#dailyBtn");

const currentIcon = document.querySelector("#current-icon");
const currentTemperature = document.querySelector("#current-temperature");
const currentState = document.querySelector("#current-state");
const apparentTemperature = document.querySelector("#apparent-temperature");
const lowTemperature = document.querySelector("#low-temperature");
const highTemperature = document.querySelector("#high-temperature");

messageOne.textContent = "";

// currentLocation.addEventListener("click", e => {
// 	if (!navigator.geolocation) {
// 		// no geolocation
// 	} else {
// 		navigator.geolocation.getCurrentPosition(
// 			position => {
// 				const latitude = position.coords.latitude;
// 				const longitude = position.coords.longitude;

// 				search.value = latitude + ", " + longitude;
// 			},
// 			error => {
// 				console.log(error);
// 			}
// 		);
// 	}
// });

weatherForm.addEventListener("submit", e => {
	e.preventDefault();

	const location = encodeURIComponent(search.value);

	messageOne.textContent = "Loading...";

	fetch("/weather?address=" + location).then(response => {
		response.json().then(data => {
			if (data.error) {
				messageOne.textContent = data.error;
			} else {
				forecastTable.innerHTML = hourlyForecast(data.forecast.hourly.data, 12);

				hourlyBtn.addEventListener("click", e => {
					forecastTable.innerHTML = hourlyForecast(data.forecast.hourly.data, 7);
				});

				dailyBtn.addEventListener("click", e => {
					forecastTable.innerHTML = dailyForecast(data.forecast.daily.data, 7);
				});

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

const hourlyForecast = (data, limit) => {
	let forecast = `<thead>
						<tr>
							<th scope="col">Time</th>
							<th scope="col"></th>
							<th scope="col">Description</th>
							<th scope="col">Temperature</th>
							<th scope="col">Precip</th>
						</tr>
					</thead>
					<tbody>`;
	for (let i = 0; i <= limit; i++) {
		const info = data[i];
		let time = moment(info.time * 1000).format("h A");

		forecast += "<tr>";
		forecast += `<td>${time}</td>
					<th scope="row">${weatherIcons[info.icon]}</td>
					<td>${info.summary}</td>
					<td>${Math.round(info.temperature)}&deg;</td>
					<td>${Math.round(info.precipProbability * 10)}%</td>`;
		forecast += "</tr>";
	}
	forecast += "</tbody>";
	return forecast;
};

const dailyForecast = (data, limit) => {
	let forecast = `<thead>
						<tr>
							<th scope="col">Day</th>
							<th scope="col"></th>
							<th scope="col">Description</th>
							<th scope="col">High/Low</th>
							<th scope="col">Precip</th>
						</tr>
					</thead>
					<tbody>`;
	for (let i = 0; i <= limit; i++) {
		const info = data[i];
		let time = moment(info.time * 1000).format("ddd");

		forecast += "<tr>";
		forecast += `<td>${time}</td>
					<th scope="row">${weatherIcons[info.icon]}</td>
					<td>${info.summary}</td>
					<td>${Math.round(info.temperatureHigh)}&deg; / ${Math.round(info.temperatureLow)}&deg;</td>
					<td>${Math.round(info.precipProbability * 10)}%</td>`;
		forecast += "</tr>";
	}
	forecast += "</tbody>";
	return forecast;
};
