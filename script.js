const form = document.getElementById("weather-form");
const searchInput = document.getElementById("search-input");
const errorMessage = document.getElementById("error-message");
const weatherDisplay = document.getElementById("weather-display");
const weatherContainer = document.getElementById("weather-container");
const API_KEY = "90b69d5f72f75dd73b0b538246fb5410";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const ENDPOINT_URL =
  "https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}&units=metric";

//fetch weather takes in an argument(inpputData) that can either be an object containing users location or inputed city
async function fetchWeather(inputData) {
  try {
    let url;

    // latitude & longitude
    if (typeof inputData === "object") {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${inputData.lat}&lon=${inputData.lon}&appid=${API_KEY}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${inputData}&appid=${API_KEY}&units=metric`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      cityNotFound();
      // fetchWeather("uyo")
      return;
    }

    const data = await res.json();
    console.log(data);
    displayResult(data);
  } catch (error) {
    console.log(error);
  }
}

//function to get input
function getInput(e) {
  e.preventDefault();
  const text = searchInput.value;
  fetchWeather(text);
  searchInput.value = "";
}

//to fetch users location
function usersLocation() {
  //default loaction incase user denies access
  const location = "Lagos";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const loc = position.coords;
      const coordinate = {
        lat: loc.latitude,
        lon: loc.longitude,
      };
      fetchWeather(coordinate);
    },

    (error) => {
      locationDenied();
      fetchWeather(location); // if access denied, default back to lagos
    },
  );
}

//function to display result
function displayResult(data) {
  //clear existing weather before adding new one
  weatherDisplay.innerHTML = "";

  // changing the sunrise & sunset codes to readable format
  const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // convert from celcius to kelvin
  // const calcTemp = data.main.temp - 273;
  // const temp = Math.round(calcTemp);

  const div = document.createElement("div");
  div.setAttribute("id", "weather-display");
  div.innerHTML = `<h2 class="text-2xl font-bold tracking-tight text-white mb-1">${data.name}</h2>
          <p
            class="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-6"
          >
            Current Weather
          </p>

          <div class="flex items-center justify-center gap-4 mb-4">
            <div class="text-6xl font-black tracking-tighter text-white">
              ${Math.round(data.main.temp)}°C
            </div>
            <img
              src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
              alt="Clear sky graphic"
              class="w-20 h-20 object-contain drop-shadow"
            />
          </div>

          <p class="text-sm text-[#94A3B8] font-medium capitalize mb-6">
            ${data.weather[0].description}
          </p>

          <hr class="w-full border-[#2D2D34] mb-6" />

          <div class="grid grid-cols-3 w-full gap-4">
            <div
              class="bg-[#121214] border border-[#2D2D34] rounded-xl p-3 flex flex-col items-center justify-center gap-1"
            >
              <span
                class="text-xs text-[#64748B] font-medium uppercase tracking-wider"
                >Wind Speed</span
              >
              <span class="text-sm font-bold text-white tracking-tight"
                >${data.wind.speed}m/s</span
              >
            </div>

            <div
              class="bg-[#121214] border border-[#2D2D34] rounded-xl p-3 flex flex-col items-center justify-center gap-1"
            >
              <span
                class="text-xs text-[#64748B] font-medium uppercase tracking-wider"
                >Humidity</span
              >
              <span class="text-sm font-bold text-white tracking-tight"
                >${data.main.humidity}%</span
              >
            </div>
            <div
              class="bg-[#121214] border border-[#2D2D34] rounded-xl p-3 flex flex-col items-center justify-center gap-1"
            >
              <span
                class="text-xs text-[#64748B] font-medium uppercase tracking-wider"
                >Pressure</span
              >
              <span class="text-sm font-bold text-white tracking-tight"
                >${data.main.pressure}%</span
              >
            </div>
          </div>

          <div class="grid grid-cols-2 w-full gap-4 mt-3">
            <div
              class="bg-[#121214] border border-[#2D2D34] rounded-xl p-3 flex flex-col items-center justify-center gap-1"
            >
              <span
                class="text-xs text-[#64748B] font-medium uppercase tracking-wider"
                >Sunrise</span
              >
              <span class="text-sm font-bold text-white tracking-tight"
                >${sunriseTime} AM</span
              >
            </div>

            <div
              class="bg-[#121214] border border-[#2D2D34] rounded-xl p-3 flex flex-col items-center justify-center gap-1"
            >
              <span
                class="text-xs text-[#64748B] font-medium uppercase tracking-wider"
                >Sunset</span
              >
              <span class="text-sm font-bold text-white tracking-tight"
                >${sunsetTime} PM</span
              >
            </div>
          </div>
          
          `;

  weatherDisplay.appendChild(div);
}

// function to display if result not found
function cityNotFound() {
  errorMessage.classList.remove("hidden");
  // errorMessage.classList.remove("block")

  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
}

// function to display if loaction is denied
function locationDenied() {
  errorMessage.classList.remove("hidden");
  // errorMessage.classList.remove("block")

  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
}

form.addEventListener("submit", getInput);
window.addEventListener("DOMContentLoaded", usersLocation);
