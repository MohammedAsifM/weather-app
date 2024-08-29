let unit = 'metric';
let isCelsius = true;
let currentWeatherData = null;
let forecastData = null;

function getWeather() {
    const apiKey = "90cd931707b176ecf3ec1134e9481eff";
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                currentWeatherData = data;
                displayWeather(data);
                updateBackground(data.weather[0].main.toLowerCase());
            } else {
                console.error('Error fetching current weather data:', data.message);
                alert('Error fetching current weather data. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                forecastData = data;
                displayDailyForecast(data.list);
            } else {
                console.error('Error fetching daily forecast data:', data.message);
                alert('Error fetching daily forecast data. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching daily forecast data:', error);
            alert('Error fetching daily forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `<p>${formatTemperature(temperature)}</p>`;
    const weatherHTML = `
        <p>${cityName}</p>
        <p>${description}</p>`;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
}

function displayDailyForecast(dailyData) {
    const dailyForecastDiv = document.getElementById('daily-forecast');
    const dailyItems = dailyData.filter(item => item.dt_txt.includes("12:00:00")); 

    let dailyItemsHTML = '';

    dailyItems.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const day = dateTime.toLocaleDateString('en-US', { weekday: 'short' });
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        dailyItemsHTML += `
            <div class="daily-item">
                <span>${day}</span>
                <img src="${iconUrl}" alt="Daily Weather Icon">
                <span>${formatTemperature(temperature)}</span>
            </div>`;
    });

    dailyForecastDiv.innerHTML = dailyItemsHTML;
}

function updateBackground(description) {
    const body = document.body;
    body.className = ''; 

    if (description.includes('clear')) {
        body.classList.add('weather-clear');
    } else if (description.includes('few clouds')) {
        body.classList.add('weather-few-clouds');
    } else if (description.includes('scattered clouds')) {
        body.classList.add('weather-scattered-clouds');
    } else if (description.includes('broken clouds')) {
        body.classList.add('weather-broken-clouds');
    } else if (description.includes('shower rain')) {
        body.classList.add('weather-shower-rain');
    } else if (description.includes('rain')) {
        body.classList.add('weather-rain');
    } else if (description.includes('thunderstorm')) {
        body.classList.add('weather-thunderstorm');
    } else if (description.includes('snow')) {
        body.classList.add('weather-snow');
    } else if (description.includes('mist')) {
        body.classList.add('weather-mist');
    } else if (description.includes('haze')) {
        body.classList.add('weather-haze');
    } else if (description.includes('fog')) {
        body.classList.add('weather-fog');
    } else if (description.includes('dust')) {
        body.classList.add('weather-dust');
    } else if (description.includes('overcast clouds')) {
        body.classList.add('weather-overcastclouds');
    } else {
        body.classList.add('weather-default');
    }
}

function toggleUnit() {
    isCelsius = !isCelsius;
    unit = isCelsius ? 'metric' : 'imperial';
    updateToggleLabel();
    if (currentWeatherData) {
        getWeather(); // Fetch data again with the new unit
    }
}

function updateToggleLabel() {
    const toggleLabel = document.getElementById('toggle-label');
    toggleLabel.textContent = isCelsius ? '°C' : '°F';
}

function formatTemperature(temp) {
    if (isCelsius) {
        return `${temp} °C`;
    } else {
        return `${temp} °F`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-button').addEventListener('click', getWeather);
    document.getElementById('city').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            getWeather();
        }
    });
    document.getElementById('unit-toggle').addEventListener('change', toggleUnit);
    updateToggleLabel();
});
