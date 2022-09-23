
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
  return (`${day}, ${month} ${currentDate}, ${hours}:${minutes}`);
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

  let iconElement = document.querySelector("#weather-icon");
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
    response.data.dt * 1000);
    iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    iconElement.setAttribute("alt", response.data.weather[0].description);
  }

function searchCity(city) {
  let apiKey = "ac209dae1f283fb332a5bb7f50b0f468";
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
  let apiKey = "ac209dae1f283fb332a5bb7f50b0f468";
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

function getFahrenheitTemperature (celsiusTemperature) {
  return (celsiusTemperature * 9) / 5 + 32;
}

let searchCityForm = document.querySelector("#search-city");
searchCityForm.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentPosition);

let unitsButton = document.querySelector("#degrees");
unitsButton.addEventListener("click", convert);

searchCity("Barcelona");
