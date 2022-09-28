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
  iconElement.setAttribute("src", getForecastIcon(response.data.weather[0].icon));
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
  document.querySelector("#input-city").value = "";
}

function linkClick(event, city) {
  event.preventDefault();
  currentCity = city;
  document.querySelector("#actual-city").innerHTML = currentCity;
  searchCity(currentCity);
  document.querySelector("#input-city").value = "";
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
                    <img id="forecastIcon"
                      src="${getForecastIcon(
                        forecastDay.weather[0].icon
                      )}"
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

function getForecastIcon (icon) {
    if (icon === "01d") {
    return `images/01d.png`;
  } if (icon === "01n") {
    return `images/01n.png`;
  } if (icon === "02d") {
    return `images/02d.png`;
  } if (icon === "02n") {
    return `images/02n.png`;
  } if (icon === "03d") {
    return `images/03d.png`;
  } if (icon === "03n") {
    return `images/03n.png`;
  } if (icon === "04d") {
    return `images/04d.png`;
  } if (icon === "04n") {
    return `images/04n.png`;
  } if (icon === "09d") {
    return `images/09d.png`;
  } if (icon === "09n") {
    return `images/09n.png`;
  } if (icon === "10d") {
    return `images/10d.png`;
  } if (icon === "10n") {
    return `images/10n.png`;
  } if (icon === "11d") {
    return `images/11d.png`;
  } if (icon === "11n") {
    return `images/11n.png`;
  } if (icon === "13d") {
    return `images/13d.png`;
  } if (icon === "13n") {
    return `images/13n.png`;
  } if (icon === "50d") {
    return `images/50d.png`;
  } if (icon === "50n") {
    return `images/50n.png`;
  }
  return "";
}

let searchCityForm = document.querySelector("#search-city");
searchCityForm.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentPosition);

let unitsButton = document.querySelector("#degrees");
unitsButton.addEventListener("click", convert);

searchCity("Barcelona");
