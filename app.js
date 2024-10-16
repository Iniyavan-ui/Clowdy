// Your OpenWeatherMap API key
const apiKey = '81f7a1b40c9687324bf79ec6724212be';

// Get current weather
function getWeather() {
    const city = document.getElementById('city').value;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weatherInfo = `
                    <div class="weather-item temp">
                        <h3>${data.main.temp}°C</h3>
                        <p>Temperature</p>
                    </div>
                    <div class="weather-item humidity">
                        <h3>${data.main.humidity}%</h3>
                        <p>Humidity</p>
                    </div>
                    <div class="weather-item wind">
                        <h3>${data.wind.speed} m/s</h3>
                        <p>Wind Speed</p>
                    </div>
                    <div class="weather-item weather-description">
                        <h3>${data.weather[0].description}</h3>
                        <p>Condition</p>
                    </div>
                `;
                document.getElementById('result').innerHTML = weatherInfo;

                window.onload = function() {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');

    // Simulate loading time
    setTimeout(() => {
        loader.style.display = 'none'; // Hide loader
        content.style.display = 'block'; // Show content
    }, 3000); // Adjust time as needed
};

                // Check if rain is expected
                if (data.weather[0].main.toLowerCase() === 'rain') {
                    showAlert('Rain is expected in your area!');
                } else {
                    closeAlert();
                }
            } else {
                document.getElementById('result').innerHTML = '<p>City not found. Please try again.</p>';
            }
        })
        .catch(error => {
            document.getElementById('result').innerHTML = '<p>Error fetching data. Please try again.</p>';
        });
}

// Get weather forecast
function getForecast() {
    const city = document.getElementById('cityForecast').value;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                let forecastHTML = '';
                let rainAlert = false;

                data.list.forEach(forecast => {
                    const dateTime = new Date(forecast.dt * 1000);
                    const icon = forecast.weather[0].icon;
                    const probability = Math.round(forecast.pop * 100); // Probability of precipitation

                    // Check if rain is expected
                    if (forecast.pop > 0.5) {
                        rainAlert = true;
                        showAlert(`Rain is expected at ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
                    }

                    forecastHTML += `
                        <div class="forecast-item">
                            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${forecast.weather[0].description}">
                            <p>${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ${forecast.main.temp}°C</p>
                            <p>${forecast.weather[0].description}, Rain probability: ${probability}%</p>
                        </div>
                    `;
                });

                document.getElementById('forecastResult').innerHTML = forecastHTML;
                if (!rainAlert) {
                    closeAlert(); // Close alert if no rain
                }
            } else {
                document.getElementById('forecastResult').innerHTML = '<p>Error fetching forecast. Please try again.</p>';
            }
        })
        .catch(error => {
            document.getElementById('forecastResult').innerHTML = '<p>Error fetching data. Please try again.</p>';
        });
}

// Show alert box
function showAlert(message) {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.innerText = message;
    alertBox.style.display = 'block'; // Show the alert box
}

// Hide alert box
function closeAlert() {
    document.getElementById('alertBox').style.display = 'none'; // Hide the alert box
}

// Set default tab visibility
document.getElementById("currentWeather").style.display = "block"; // Show current weather tab by default
