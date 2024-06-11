const apiKey = '5ee4956d30d6fac231cd7ebbc3e63016';
let city = String
let isLightTheme = Boolean;

window.onload = function() {
    checkThemeBasedOnTime();
}

function checkThemeBasedOnTime() {
    const currentTime = getCurrentTime();
    const hours = parseInt(currentTime.split(':')[0]);
    const root = document.documentElement;

    if ((hours >= 0 && hours < 6) || (hours >= 20 && hours <= 23)) {
        root.classList.add('default-dark-theme');
        root.classList.remove('default-light-theme', 'clear-light-theme', 'clear-dark-theme', 'rain-light-theme', 'rain-dark-theme');
        isLightTheme = false;
    } else {
        root.classList.add('default-light-theme');
        root.classList.remove('default-dark-theme', 'clear-light-theme', 'clear-dark-theme', 'rain-light-theme', 'rain-dark-theme');
        isLightTheme = true;
    }
}


function toggleThemeTime(weatherText) {
    const currentTime = getCurrentTime();
    const hours = parseInt(currentTime.split(':')[0]);
    const root = document.documentElement;

    root.classList.remove('default-dark-theme', 'default-light-theme', 'clear-dark-theme', 'clear-light-theme', 'rain-dark-theme', 'rain-light-theme');

    if (weatherText.includes('clear')) {
        if ((hours >= 0 && hours < 6) || (hours >= 20 && hours <= 23)) {
            root.classList.add('clear-dark-theme');
            root.classList.remove('default-light-theme', 'default-dark-theme', 'clear-light-theme', 'rain-light-theme', 'rain-dark-theme');
            isLightTheme = false;
        } else {
            root.classList.add('clear-light-theme');
            root.classList.remove('default-light-theme', 'default-dark-theme', 'clear-dark-theme', 'rain-light-theme', 'rain-dark-theme');
            isLightTheme = true;
        }
    } else if (weatherText.includes('rain')) {
        if ((hours >= 0 && hours < 6) || (hours >= 20 && hours <= 23)) {
            root.classList.add('rain-dark-theme');
            root.classList.remove('default-light-theme', 'default-dark-theme', 'clear-light-theme', 'clear-dark-theme', 'rain-light-theme');
            isLightTheme = false;
        } else {
            root.classList.add('rain-light-theme');
            root.classList.remove('default-light-theme', 'default-dark-theme', 'clear-light-theme', 'clear-dark-theme', 'rain-dark-theme');
            isLightTheme = true;
        }
    } else {
        if ((hours >= 0 && hours < 6) || (hours >= 20 && hours <= 23)) {
            root.classList.add('default-dark-theme');
            root.classList.remove('default-light-theme', 'clear-light-theme', 'clear-dark-theme', 'rain-light-theme', 'rain-dark-theme');
            isLightTheme = false;
        } else {
            root.classList.add('default-light-theme');
            root.classList.remove('default-dark-theme', 'clear-light-theme', 'clear-dark-theme', 'rain-light-theme', 'rain-dark-theme');
            isLightTheme = true;
        }
    }
}

function toggleTheme() {
    const root = document.documentElement;
    let weatherText = String;

    try{
        weatherText = document.querySelector('#weather-info p:nth-child(2)').textContent.toLowerCase();
    }
    catch{
        weatherText = "default";
    }
    
    if (weatherText.includes('clear')) {
        if (isLightTheme) {
            root.classList.add('clear-dark-theme');
            root.classList.remove('default-light-theme', 'default-dark-theme', 'clear-light-theme', 'rain-light-theme', 'rain-dark-theme');

        } else {
            root.classList.add('clear-light-theme');
            root.classList.remove('default-light-theme', 'default-dark-theme', 'clear-dark-theme', 'rain-light-theme', 'rain-dark-theme');

        }
    } else if (weatherText.includes('rain')) {
        if (isLightTheme) {
            root.classList.add('rain-dark-theme');
            root.classList.remove('default-light-theme', 'default-dark-theme', 'clear-light-theme', 'clear-dark-theme', 'rain-light-theme');

        } else {
            root.classList.add('rain-light-theme');
            root.classList.remove('default-light-theme', 'default-dark-theme', 'clear-light-theme', 'clear-dark-theme', 'rain-dark-theme');

        }
    } else {
        if (isLightTheme) { 
            root.classList.add('default-dark-theme');
            root.classList.remove('default-light-theme', 'clear-light-theme', 'clear-dark-theme', 'rain-light-theme', 'rain-dark-theme');

        } else {
            root.classList.add('default-light-theme');
            root.classList.remove('default-dark-theme', 'clear-light-theme', 'clear-dark-theme', 'rain-light-theme', 'rain-dark-theme');
        }
    }
    isLightTheme = !isLightTheme

}


function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedTime = `${hours}:${minutes}:${seconds}`;

    console.log(formattedTime)

    return formattedTime;
}


function getWeather() {
    city = document.getElementById('city').value;
    console.log(city);

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
            displayWeeklyForecast(data.list);
            saveWeatherDataToLocalStorage(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}


function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        toggleThemeTime(description)
    
        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); 
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}

function displayWeeklyForecast(forecastData) {
    const weeklyForecastDiv = document.getElementById('weekly-forecast');
    weeklyForecastDiv.innerHTML = ''; 

    const dailyData = {};

    // Get current time
    const currentTime = getCurrentTime();
    const currentHour = parseInt(currentTime.split(':')[0]);

    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayOfMonth = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'long' });

        const key = `${dayOfWeek}, ${dayOfMonth} ${month}`;

        if (!dailyData[key]) {
            dailyData[key] = [];
        }

        dailyData[key].push(item);
    });

    function findClosestHour(data) {
        if (data.length === 0) return null;

        let closestItem = data[0];
        let closestDiff = Math.abs(new Date(closestItem.dt * 1000).getHours() - currentHour);

        data.forEach(item => {
            const itemHour = new Date(item.dt * 1000).getHours();
            const diff = Math.abs(itemHour - currentHour);

            if (diff < closestDiff) {
                closestItem = item;
                closestDiff = diff;
            }
        });

        return closestItem;
    }

    Object.keys(dailyData).forEach(day => {
        const closestItem = findClosestHour(dailyData[day]);
        let weeklyItemHtml;

        if (closestItem) {
            const temperature = Math.round(closestItem.main.temp - 273.15);
            const iconCode = closestItem.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            weeklyItemHtml = `
                <div class="weekly-item">
                    <span>${day}</span>
                    <img src="${iconUrl}" alt="Weekly Weather Icon">
                    <span>${temperature}°C</span>
                </div>
            `;
        } else {
            weeklyItemHtml = `
                <div class="weekly-item">
                    <span>${day}</span>
                    <span>API data not found</span>
                </div>
            `;
        }

        weeklyForecastDiv.innerHTML += weeklyItemHtml;
    });
}
function saveWeatherDataToLocalStorage(weatherData) {
    let savedData = JSON.parse(localStorage.getItem('weatherData')) || {};

    if (savedData[weatherData.city.name]) {
        savedData[weatherData.city.name].push({
            currentWeather: {
                temperature: weatherData.list[0].main.temp,
                description: weatherData.list[0].weather[0].description
            },
            dailyWeather: {}
        });

        weatherData.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!savedData[weatherData.city.name][savedData[weatherData.city.name].length - 1].dailyWeather[date]) {
                savedData[weatherData.city.name][savedData[weatherData.city.name].length - 1].dailyWeather[date] = [];
            }
            savedData[weatherData.city.name][savedData[weatherData.city.name].length - 1].dailyWeather[date].push({
                datetime: item.dt_txt,
                temperature: item.main.temp,
                description: item.weather[0].description
            });
        });
    } else {
        savedData[weatherData.city.name] = [{
            currentWeather: {
                temperature: weatherData.list[0].main.temp,
                description: weatherData.list[0].weather[0].description
            },
            dailyWeather: {}
        }];

        weatherData.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!savedData[weatherData.city.name][0].dailyWeather[date]) {
                savedData[weatherData.city.name][0].dailyWeather[date] = [];
            }
            savedData[weatherData.city.name][0].dailyWeather[date].push({
                datetime: item.dt_txt,
                temperature: item.main.temp,
                description: item.weather[0].description
            });
        });
    }

    localStorage.setItem('weatherData', JSON.stringify(savedData));
}