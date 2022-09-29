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

let isFahrenheit = false;
let currentApiResponse;
let forecastApiResponse;

function convert(event) {
  event.preventDefault();
  isFahrenheit = !isFahrenheit;
  displayWeatherCondition(currentApiResponse);
  displayForecast(forecastApiResponse);
}

function getFahrenheitTemperature(celsiusTemperature) {
  return (celsiusTemperature * 9) / 5 + 32;
}

function getWeatherMaxMin(apiTempMax, apiTempMin) {
  let tempMax;
  let tempMin;
  if (!isFahrenheit) {
    tempMax = Math.round(apiTempMax);
    if (tempMax > 0) tempMax = `+${tempMax}°C`;
    else tempMax = `${tempMax}°C`;
    tempMin = Math.round(apiTempMin);
    if (tempMin > 0) tempMin = `+${tempMin}°C`;
    else tempMin = `${tempMin}°C`;
  } else {
    tempMax = Math.round(getFahrenheitTemperature(apiTempMax));
    if (tempMax > 0) tempMax = `+${tempMax}°F`;
    else tempMax = `${tempMax}°F`;
    tempMin = Math.round(getFahrenheitTemperature(apiTempMin));
    if (tempMin > 0) tempMin = `+${tempMin}°F`;
    else tempMin = `${tempMin}°F`;
  }
  return { tempMax, tempMin };
}

function displayWeatherCondition(response) {
  currentApiResponse = response;
  let temp = getWeatherMaxMin(
    response.data.main.temp_max,
    response.data.main.temp_min
  );

  document.querySelector("#actual-city").innerHTML = response.data.name;
  document.querySelector("#actual-temperature").innerHTML = `${
    temp.tempMax
  }${"\u00A0"}${"\u00A0"}${temp.tempMin}`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector(
    "#actual-date-time"
  ).innerHTML = `Last updated on ${formatDate(response.data.dt * 1000)}`;

  getWeatherIcon(response);
  getForecast(response.data.coord);
}

function getWeatherIcon(response) {
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute("src", getIcon(response.data.weather[0].icon));
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function getIcon(icon) {
  return `images/${icon}.png`;
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
  document.querySelector("#input-city").value = "";
}

function getForecast(coordinates) {
  let apiKey = "2513f3c728b1b5ff4f4347e1a6af22b8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function linkClick(event, city) {
  event.preventDefault();
  currentCity = city;
  document.querySelector("#actual-city").innerHTML = currentCity;
  searchCity(currentCity);
  document.querySelector("#input-city").value = "";
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
  forecastApiResponse = response;
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class="row row-cols-1 row-cols-md-5 g-1">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      let temp = getWeatherMaxMin(forecastDay.temp.max, forecastDay.temp.min);
      forecastHTML =
        forecastHTML +
        `<div class="col">
              <div class="card">
                <div class="card h-100">
                  <div class="card-body">
                    <h5 class="card-title">${formatDay(forecastDay.dt)}</h5>
                      <div id="forecast-temperature">${
                        temp.tempMax
                      }${"\u00A0"}${"\u00A0"}${temp.tempMin}
                      </div>
                        <ul>
                          <li>
                          <span class = "forecast-description">${
                            forecastDay.weather[0].description
                          }</span>
                          </li>
                          <li>
                            Humidity: <span class = "forecast-humidity">${
                              forecastDay.humidity
                            }</span>%
                          </li>
                          <li>
                            Wind: <span class = "forecast-wind">${Math.round(
                              forecastDay.wind_speed
                            )}</span> m/sec
                          </li>
                          </ul> 
                          <img id="forecastIcon"
                            src="${getIcon(forecastDay.weather[0].icon)}"
                            class="card-img-bottom"
                            alt="${forecastDay.weather[0].description}"
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
