function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let currentDate = date.getDate();
  let hours = date.getHours();
  hours = hours > 9 ? hours : "0" + hours;
  let minutes = date.getMinutes();
  minutes = minutes > 9 ? minutes : "0" + minutes;
  return `${day}, ${month} ${currentDate}, ${hours}:${minutes}`;
}

function displayWeatherCondition(response) {
  currentApiResponse = response;
  let tempMax;
  let tempMin;
  if (!isFahrenheit) {
    tempMax = Math.round(response.data.main.temp_max);
    if (tempMax > 0) tempMax = `+${tempMax}°C`;
    else tempMax = `${tempMax}°C`;
    tempMin = Math.round(response.data.main.temp_min);
    if (tempMin > 0) tempMin = `+${tempMin}°C`;
    else tempMin = `${tempMin}°C`;
  } else {
    tempMax = Math.round(getFahrenheitTemperature(response.data.main.temp_max));
    if (tempMax > 0) tempMax = `+${tempMax}°F`;
    else tempMax = `${tempMax}°F`;
    tempMin = Math.round(getFahrenheitTemperature(response.data.main.temp_min));
    if (tempMin > 0) tempMin = `+${tempMin}°F`;
    else tempMin = `${tempMin}°F`;
  }
  getWeatherIcon(response);
  document.querySelector("#actual-city").innerHTML = response.data.name;
  document.querySelector(
    "#actual-temperature"
  ).innerHTML = `${tempMax}${"\u00A0"}${"\u00A0"}${tempMin}`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#actual-date-time").innerHTML = formatDate(
    response.data.dt * 1000
  );

  getForecast(response.data.coord);
}

function getWeatherIcon(response) {
  let iconElement = document.querySelector("#weather-icon");
  if (response.data.weather[0].icon === "01d") {
    iconElement.setAttribute("src", `images/01d.png`);
  } else if (response.data.weather[0].icon === "01n") {
    iconElement.setAttribute("src", `images/01n.png`);
  } else if (response.data.weather[0].icon === "02d") {
    iconElement.setAttribute("src", `images/02d.png`);
  } else if (response.data.weather[0].icon === "02n") {
    iconElement.setAttribute("src", `images/02n.png`);
  } else if (response.data.weather[0].icon === "03d") {
    iconElement.setAttribute("src", `images/03d.png`);
  } else if (response.data.weather[0].icon === "03n") {
    iconElement.setAttribute("src", `images/03n.png`);
  } else if (response.data.weather[0].icon === "04d") {
    iconElement.setAttribute("src", `images/04d.png`);
  } else if (response.data.weather[0].icon === "04n") {
    iconElement.setAttribute("src", `images/04n.png`);
  } else if (response.data.weather[0].icon === "09d") {
    iconElement.setAttribute("src", `images/09d.png`);
  } else if (response.data.weather[0].icon === "09n") {
    iconElement.setAttribute("src", `images/09n.png`);
  } else if (response.data.weather[0].icon === "10d") {
    iconElement.setAttribute("src", `images/10d.png`);
  } else if (response.data.weather[0].icon === "10n") {
    iconElement.setAttribute("src", `images/10n.png`);
  } else if (response.data.weather[0].icon === "11d") {
    iconElement.setAttribute("src", `images/11d.png`);
  } else if (response.data.weather[0].icon === "11n") {
    iconElement.setAttribute("src", `images/11n.png`);
  } else if (response.data.weather[0].icon === "13d") {
    iconElement.setAttribute("src", `images/13d.png`);
  } else if (response.data.weather[0].icon === "13n") {
    iconElement.setAttribute("src", `images/13n.png`);
  } else if (response.data.weather[0].icon === "50d") {
    iconElement.setAttribute("src", `images/50d.png`);
  } else if (response.data.weather[0].icon === "50n") {
    iconElement.setAttribute("src", `images/50n.png`);
  }
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function getForecast(coordinates) {
  let apiKey = "2513f3c728b1b5ff4f4347e1a6af22b8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function searchCity(city) {
  let apiKey = "2513f3c728b1b5ff4f4347e1a6af22b8";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "2513f3c728b1b5ff4f4347e1a6af22b8";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function linkClick(event, city) {
  event.preventDefault();
  currentCity = city;
  document.querySelector("#actual-city").innerHTML = currentCity;
  searchCity(currentCity);
}

let isFahrenheit = false;
let currentApiResponse;

function convert(event) {
  event.preventDefault();
  isFahrenheit = !isFahrenheit;
  displayWeatherCondition(currentApiResponse);
}

function getFahrenheitTemperature(celsiusTemperature) {
  return (celsiusTemperature * 9) / 5 + 32;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(response.data.daily[0].weather[0].icon);
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class="row row-cols-1 row-cols-md-5 g-1">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col">
        <div class="card">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${formatDay(forecastDay.dt)}</h5>
                <div class="forecast-temperature"><span class="forecast-temperature-max">${Math.round(
                  forecastDay.temp.max
                )}</span>°C${"\u00A0"}${"\u00A0"}<span class="forecast-temperature-min">${Math.round(
          forecastDay.temp.min
        )}</span>°C</div>
                  <ul>
                    <li>
                    <span class = "forecast-description">${
                      forecastDay.weather[0].description
                    }</span>
                    </li>
                    <li>
                      Humidity:<span class = "forecast-humidity">${
                        forecastDay.humidity
                      }</span>%
                    </li>
                    <li>
                      Wind:<span class = "forecast-wind">${Math.round(
                        forecastDay.wind_speed
                      )}</span> m/sec
                    </li>
                    </ul> 
                    <img
                      src="http://openweathermap.org/img/wn/${
                        forecastDay.weather[0].icon
                      }@2x.png"
                      class="card-img-bottom"
                      alt=" "
                    />
            </div>
          </div>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let searchCityForm = document.querySelector("#search-city");
searchCityForm.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentPosition);

let unitsButton = document.querySelector("#degrees");
unitsButton.addEventListener("click", convert);

searchCity("Barcelona");
