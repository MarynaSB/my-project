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


let isFahrenheit = false;
let currentTemperatureMin;
let currentTemperatureMax;
let currentCity = '';

function searchCity (event) {
  event.preventDefault();
  getCityTemperature();
}

function getCityTemperature() {
  let cityInput = document.querySelector("#input-city");
  let actualCity = document.querySelector(".actualCity");
  if (cityInput.value) currentCity = cityInput.value;
  if (currentCity) {
    actualCity.innerHTML = currentCity;
    callApi(currentCity);
  } else {
    currentCity = null;
    actualCity.innerHTML = null;
    alert("Please type a city");
  }
}

function linkClick(event, city) {
  event.preventDefault();
  let cityInput = document.querySelector("#input-city");
  cityInput.value = null;
  currentCity = city;
  let actualCity = document.querySelector(".actualCity");
  if (currentCity) {
    actualCity.innerHTML = currentCity;
    callApi(currentCity);
  }
}

function geoLocationClick(position) {
  let apiKey = "ac209dae1f283fb332a5bb7f50b0f468";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  if (isFahrenheit) units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
 
  axios.get(apiUrl).then(function (response) {
    setTemp(response);
     let actualCity = document.querySelector(".actualCity");
      currentCity = response.data.name;
      actualCity.innerHTML = currentCity;
      let cityInput = document.querySelector("#input-city");
      cityInput.value = "";
  });
}

  function getCurrentPosition () {
    navigator.geolocation.getCurrentPosition(geoLocationClick);
  }

function callApi(city) {
  let apiKey = "ac209dae1f283fb332a5bb7f50b0f468";
  let units = "metric";
  if (isFahrenheit) units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(function (response) {
    setTemp(response);
  });
}

function setTemp (response) {
currentTemperatureMin = Math.round(response.data.main.temp_min);
currentTemperatureMax = Math.round(response.data.main.temp_max);
let currentTemperature = document.querySelector(".actual-temperature");
let degreeSign = "°C";
if (isFahrenheit) {
  degreeSign = "°F";
}
currentTemperature.innerHTML = `${temperatureSign(
  currentTemperatureMax
)}${currentTemperatureMax}${degreeSign}  ${temperatureSign(
  currentTemperatureMin
)}${currentTemperatureMin}${degreeSign}`;
}

function temperatureSign(temperature) {
  if (temperature > 0) return "+";
  return "";
}

function convert(event) {
  event.preventDefault();
  isFahrenheit = !isFahrenheit;
  getCityTemperature();
}

let fahrenheit = document.querySelector(".degrees");
fahrenheit.addEventListener("click", convert);

let currentButton = document.querySelector(".current-location");
currentButton.addEventListener("click", getCurrentPosition);

let searchCityForm = document.querySelector("#search-city");
searchCityForm.addEventListener("submit", searchCity);
