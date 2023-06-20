// Get the necessary DOM elements
const weatherDiv = document.getElementById("weather");
const hourlyWeather = document.getElementById("hourlyWeather");
const currentDate = document.getElementById("date");
const weatherForecast = document.getElementById("weatherForecast");
const card = document.getElementsByClassName("card1")[0];
const form = document.getElementById("weatherForm");

// Add event listener to the form for submitting the weather request
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = document.getElementById("city").value.toLowerCase();
  checkWeather(city);
  card.style.visibility = "visible";
  hourlyWeather.style.visibility = "visible";
  form.reset();
});

// Function to fetch and display weather data
async function checkWeather(city) {
  const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=dcccbb689c824b7096e191807231705&q=${city}&days=10&aqi=no`);
  const data = await response.json();
  //Easy for visualization of the object
  console.log(data);  

  const location = data.location;
  const current = data.current;
  const forecast = data.forecast.forecastday;
  const dayForecast = forecast[0].day;
  const astroForecast = forecast[0].astro;
  const date = forecast[0].date;
  const parts = date.split("-");
  const Adate = `${parts[1]}-${parts[2]}-${parts[0]}`;
  const hour = forecast[0].hour;

  weatherDiv.innerHTML = `
    <p>${location.name}</p>
    <p>${location.region}</p>
    <h1>${current.temp_f}°F</h1>
    <img src=${current.condition.icon} width="150" height="150">
    <p>${current.condition.text}</p>
    <p>Low: ${dayForecast.mintemp_f}°F | High: ${dayForecast.maxtemp_f}°F | Wind: ${current.wind_mph} mph</p>
  `;

  currentDate.innerHTML = `
    <h3>Hourly Weather for ${Adate}</h3>
    <hr>
    <p>Sunrise: ${astroForecast.sunrise} - Sunset: ${astroForecast.sunset}</p>
  `;

  let weatherContent = '';

  hour.forEach((item) => {
    let time = item.time.split(' ')[1];
    let tempF = item.temp_f;
    let icon = item.condition.icon;

    weatherContent += `
      <div class="col-2">
        <p>${time}</p>
        <img src="${icon}" alt="Weather Icon" width="45" height="45">
        <p>${tempF}°F</p>
        <hr>
      </div>`;
  });

  hourlyWeather.innerHTML = weatherContent;

  weatherForecast.innerHTML = `<h3>Weather Forecast for ${forecast.length} Days</h3><hr>`;
  

  for (let i = 0; i < forecast.length; i++) {
    const days = forecast[i];
    const date2 = days.date;
    const parts2 = date2.split("-");
    const Adate2 = `${parts2[1]}-${parts2[2]}-${parts2[0]}`;
    const averageTemp = days.day.avgtemp_f;
    const wind = days.day.maxwind_mph;
    const minTempF = days.day.mintemp_f;
    const maxTempF = days.day.maxtemp_f;
    const condition = days.day.condition;

    const card = document.createElement("div");
    card.classList.add("card2", "mb-3");

    const cardContent = `
      <h5 class="card-title">${Adate2}</h5>
      <img src="${condition.icon}" alt="Weather Icon" class="card-img-top">
      <p>${condition.text}</p>
      <p class="card-text">${averageTemp}°F</p>
      <p class="card-text">Low: ${minTempF}°F | High: ${maxTempF}°F | Wind: ${wind} mph</p>
    `;

    card.innerHTML = cardContent;
    weatherForecast.appendChild(card);
  }
}
