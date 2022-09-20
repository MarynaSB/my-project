function updateDate (newDate) {
let actualDateTime = document.querySelector(".actual-date-time");
actualDateTime.innerHTML = newDate;
}

function formatDate(currentDate) {
  
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentDate.getDay()];

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
  let month = months[currentDate.getMonth()];

  let date = currentDate.getDate();
  let hour = currentDate.getHours();
  hour = hour > 9 ? hour : "0" + hour;
  let minutes = currentDate.getMinutes();
  minutes = minutes > 9 ? minutes : "0" + minutes;
  
  return (`${day}, ${month} ${date}, ${hour}:${minutes}`);
}

updateDate(formatDate(new Date()));


function displayWeatherCondition(response) {
  let tempMax = Math.round(response.data.main.temp_max);
  if (tempMax > 0) tempMax = `+${tempMax}°C`;
  else tempMax = `${tempMax}°C`;
  let tempMin = Math.round(response.data.main.temp_min);
  if (tempMin > 0) tempMin = `+${tempMin}°C`;
  else tempMin = `${tempMin}°C`;
  document.querySelector(".actual-city").innerHTML = response.data.name;
  document.querySelector(
    ".actual-temperature"
  ).innerHTML = `${tempMax}${"\u00A0"}${"\u00A0"}${tempMin}`;
  document.querySelector(".description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
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
  // if (isFahrenheit) units = "imperial";
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
  document.querySelector(".actual-city").innerHTML = currentCity;
  searchCity(currentCity);
}

let searchCityForm = document.querySelector("#search-city");
searchCityForm.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector(".current-location");
currentButton.addEventListener("click", getCurrentPosition);

searchCity("Barcelona");