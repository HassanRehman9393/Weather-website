const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const cityInput = document.getElementById('city-input');
const submitBtn = document.getElementById('submit-btn');
const cityNameElem = document.getElementById('city-name');
const countryNameElem = document.getElementById('country-name');
const temperatureElem = document.getElementById('temperature');
const humidityElem = document.getElementById('humidity');
const windSpeedElem = document.getElementById('wind-speed');
const descriptionElem = document.getElementById('description');
const weatherIconElem = document.getElementById('weather-icon');
const timeElem = document.getElementById('local-time');
const forecastElem = document.getElementById('forecast'); 

let chartData = {
    temperature: [],
    labels: [],
    weatherConditions: []
};

// Toggle between light and dark theme
themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
        body.classList.replace('dark-theme', 'light-theme');
        themeToggle.src = 'images/moon.png';
        updateChartColors('light');
    } else {
        body.classList.replace('light-theme', 'dark-theme');
        themeToggle.src = 'images/sun.png';
        updateChartColors('dark');
    }
});


// Toggle temperature units (Celsius or Fahrenheit)
const tempToggle = document.createElement('div');
tempToggle.classList.add('temp-toggle');
tempToggle.innerHTML = `
    <label class="switch">
        <input type="checkbox" id="temp-switch">
        <span class="slider round"></span>
    </label>
    <span id="temp-label">°C</span>
`;
document.querySelector('.temp-toggle').replaceWith(tempToggle);

const tempSwitch = document.getElementById('temp-switch');
const tempLabel = document.getElementById('temp-label');
let unit = 'metric'; 

// Event listener for toggle switch
tempSwitch.addEventListener('change', () => {
    unit = tempSwitch.checked ? 'imperial' : 'metric';
    tempLabel.textContent = tempSwitch.checked ? '°F' : '°C';
    const city = cityInput.value;
    if (city) {
        getCoordsFromCity(city);
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        });
    }
});

// Search for city weather when clicking submit
submitBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getCoordsFromCity(city);
    } else {
        alert("Please enter a city name.");
    }
});
// Search for city weather when pressing Enter key
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value;
        if (city) {
            getCoordsFromCity(city);
        } else {
            alert("Please enter a city name.");
        }
    }
});

// Initialize the map
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Get user location if available
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
        map.setView([lat, lon], 10);
    }, () => {
        alert("Unable to retrieve your location.");
    });
}

function getWeatherByCoords(lat, lon) {
    const apiKey = '6efb492bbb7bbe9aa82b78c2d96c2b6c';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {  
            const cityName = data.name;
            const countryName = data.sys.country;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const description = data.weather[0].description;

            cityNameElem.innerText = cityName;
            countryNameElem.innerText = countryName;
            temperatureElem.innerText = `${temperature} ${unit === 'metric' ? '°C' : '°F'}`;
            humidityElem.innerText = `${humidity}%`;
            windSpeedElem.innerText = `${windSpeed} m/s`;
            descriptionElem.innerText = description;
            weatherIconElem.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

            displayLocalTime(lat, lon);
            getForecastForCharts(lat, lon);
            getWeatherForecastByCoords(lat, lon);
            updateChartData([temperature], ['Current'], description);
        })
        .catch(error => console.error('Error fetching the weather data:', error));
        return lat, lon;
}


// Fetch coordinates from city name
function getCoordsFromCity(city) {
    const url = `https://nominatim.openstreetmap.org/search?q=${city}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                map.setView([lat, lon], 10);
                getWeatherByCoords(lat, lon);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching coordinates:', error));
}

// Display local time based on coordinates
function displayLocalTime(lat, lon) {
    const apiKey = 'YOUR_TIMEZONE_API_KEY';
    const url = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${lat}&longitude=${lon}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const timeZone = data.timezone;
            const now = new Date();
            const options = {
                timeZone: timeZone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            const localTime = now.toLocaleString('en-US', options);
            timeElem.innerText = `${localTime}`;
        })
        .catch(error => console.error('Error fetching timezone data:', error));
}

// Map click event to get weather for clicked location
map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    map.setView([lat, lon], 10);
    getWeatherByCoords(lat, lon);
});

function getForecastForCharts(lat, lon) {
    const apiKey = '6efb492bbb7bbe9aa82b78c2d96c2b6c';
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const forecastList = data.list; 
            const temperatureData = [];
            const labels = [];
            const weatherConditions = [];

            forecastList.forEach((entry, index) => {
                if (index % 8 === 0) { 
                    const date = new Date(entry.dt_txt).toLocaleDateString();
                    temperatureData.push(entry.main.temp);
                    labels.push(date);
                    weatherConditions.push(entry.weather[0].description);
                }
            });
            updateChartData(temperatureData, labels, weatherConditions);
        })
        .catch(error => console.error('Error fetching the forecast data:', error));
}


function updateChartData(temperatureData, labels, weatherConditions) {
    barChart.data.labels = labels;
    barChart.data.datasets[0].data = temperatureData;
    barChart.update();

    const weatherCount = {
        clear: 0,
        cloudy: 0,
        rain: 0
    };

    weatherConditions.forEach(condition => {
        if (condition.includes('clear')) weatherCount.clear++;
        else if (condition.includes('clouds')) weatherCount.cloudy++;
        else if (condition.includes('rain')) weatherCount.rain++;
    });

    doughnutChart.data.datasets[0].data = [weatherCount.clear, weatherCount.cloudy, weatherCount.rain];
    doughnutChart.update();

    lineChart.data.labels = labels;
    lineChart.data.datasets[0].data = temperatureData;
    lineChart.update();
}


// Sidebar toggle functionality
const logo = document.getElementById('logo');
const sidebar = document.getElementById('sidebar');

document.addEventListener('DOMContentLoaded', function () {
    const logo = document.getElementById('logo');
    const sidebar = document.getElementById('sidebar');
    const dashboardButton = document.getElementById('dashboard');
    const tableButton = document.getElementById('table');

    // Toggle sidebar on logo click
    logo.addEventListener('click', function () {
        console.log('Logo clicked');
        sidebar.classList.toggle('active');
    });

    // Close sidebar on close button click
    document.querySelector('.close-btn').addEventListener('click', function () {
        sidebar.classList.remove('active');
    });

    // Close sidebar when clicking outside of it
    document.addEventListener('click', function (event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnLogo = logo.contains(event.target);

        if (sidebar.classList.contains('active') && !isClickInsideSidebar && !isClickOnLogo) {
            sidebar.classList.remove('active');
        }
    });

    dashboardButton.addEventListener('click', function () {
        sidebar.classList.remove('active');
    });

    tableButton.addEventListener('click', function () {
        sidebar.classList.remove('active');
    });
});

function updateChartColors(theme) {
    if (theme === 'dark') {
        // Dark theme colors
        barChart.data.datasets[0].backgroundColor = 'rgba(255, 99, 71, 0.6)';
        barChart.data.datasets[0].borderColor = 'rgba(255, 99, 71, 1)'; 

        doughnutChart.data.datasets[0].backgroundColor = [
            'rgba(255, 215, 0, 0.6)', 
            'rgba(173, 216, 230, 0.6)', 
            'rgba(144, 238, 144, 0.6)'  
        ];
        doughnutChart.data.datasets[0].borderColor = [
            'rgba(255, 215, 0, 1)',    
            'rgba(173, 216, 230, 1)',  
            'rgba(144, 238, 144, 1)'  
        ];

        lineChart.data.datasets[0].backgroundColor = 'rgba(255, 182, 193, 0.6)'; // Light Pink
        lineChart.data.datasets[0].borderColor = 'rgba(255, 182, 193, 1)'; // Light Pink (solid)

    } else {
        // Light theme colors
        barChart.data.datasets[0].backgroundColor = 'rgba(75, 192, 192, 0.2)';
        barChart.data.datasets[0].borderColor = 'rgba(75, 192, 192, 1)';

        doughnutChart.data.datasets[0].backgroundColor = [
            'rgba(255, 99, 132, 0.2)', 
            'rgba(54, 162, 235, 0.2)', 
            'rgba(75, 192, 192, 0.2)'  
        ];
        doughnutChart.data.datasets[0].borderColor = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)'
        ];

        lineChart.data.datasets[0].backgroundColor = 'rgba(153, 102, 255, 0.2)';
        lineChart.data.datasets[0].borderColor = 'rgba(153, 102, 255, 1)';
    }

    // Clear and update charts to redraw properly
    barChart.clear();
    doughnutChart.clear();
    lineChart.clear();

    // Update the charts with new colors
    barChart.update();
    doughnutChart.update();
    lineChart.update();
}


// Bar chart
var ctxBar = document.getElementById('barChart').getContext('2d');
var barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [{
            label: 'Temperature',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        
        }]
    },
    options: {
        indexAxis: 'x',
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Doughnut chart with delay animation
var ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
var doughnutChart = new Chart(ctxDoughnut, {
    type: 'doughnut',
    data: {
        labels: ['Clear', 'Cloudy', 'Rain'],
        datasets: [{
            label: 'Weather Conditions',
            data: [], 
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        indexAxis: 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        animation: {
            onComplete: function() {},
            delay: function(context) {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && context.dataIndex !== null) {
                    delay = context.dataIndex * 300; 
                }
                return delay;
            }
        }
    }
});


// Line chart
var ctxLine = document.getElementById('lineChart').getContext('2d');
var lineChart = new Chart(ctxLine, {
    type: 'line',
    
    data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [{
            label: 'Temperature',
            data: [],  
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        indexAxis: 'x',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            onComplete: function() {},
            easing: 'easeInBounce',
            duration: 1500,
            y: {
                from: -500, 
            }
        }
    }
});



document.addEventListener('DOMContentLoaded', function () {
    const isDarkTheme = body.classList.contains('dark-theme');
    updateChartColors(isDarkTheme ? 'dark' : 'light');
});



let allForecasts = []; 
let filteredForecasts = []; 
let currentPage = 0; 
const itemsPerPage = 5; 

function getWeatherForecastByCoords(lat, lon) {
    const apiKey = '6efb492bbb7bbe9aa82b78c2d96c2b6c';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=40`; // Fetch 40 items (5 days * 8 times per day)

    fetch(url)
        .then(response => response.json())
        .then(data => {
            allForecasts = data.list; // Store all forecasts
            filteredForecasts = [...allForecasts]; // Initialize filtered forecasts
            currentPage = 0; // Reset to first page
            displayForecastPage(currentPage);

            // Add event listeners to pagination buttons
            document.getElementById('prev-btn').addEventListener('click', () => {
                if (currentPage > 0) {
                    currentPage--;
                    displayForecastPage(currentPage);
                }
            });

            document.getElementById('next-btn').addEventListener('click', () => {
                if ((currentPage + 1) * itemsPerPage < filteredForecasts.length) {
                    currentPage++;
                    displayForecastPage(currentPage);
                }
            });

            // Add event listener to filter dropdown
            document.getElementById('filter-dropdown').addEventListener('change', (event) => {
                applyFilter(event.target.value);
            });
        })
        .catch(error => console.error('Error fetching the forecast data:', error));
}

function displayForecastPage(page) {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageForecasts = filteredForecasts.slice(startIndex, endIndex);

    displayForecast(pageForecasts);
    updatePaginationInfo();
}

function updatePaginationInfo() {
    const pageInfo = document.getElementById('page-info');
    const totalPages = Math.ceil(filteredForecasts.length / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;

    // Enable/disable pagination buttons
    document.getElementById('prev-btn').disabled = (currentPage === 0);
    document.getElementById('next-btn').disabled = (currentPage === currentPage + 1);
}

function applyFilter(filterType) {
    currentPage = 0; // Reset to first page

    if (filterType === 'default') {
        filteredForecasts = [...allForecasts];
    } else if (filterType === 'asc') {
        filteredForecasts = [...allForecasts].sort((a, b) => a.main.temp - b.main.temp);
    } else if (filterType === 'desc') {
        filteredForecasts = [...allForecasts].sort((a, b) => b.main.temp - a.main.temp);
    } else if (filterType === 'rain') {
        filteredForecasts = allForecasts.filter(item => item.pop > 0);
    } else if (filterType === 'highest') {
        const highestTempDay = allForecasts.reduce((max, item) => (item.main.temp > max.main.temp ? item : max));
        filteredForecasts = [highestTempDay];
    }

    displayForecastPage(currentPage);
}

function displayForecast(forecasts) {
    const tableBody = document.getElementById('weather-table-body');
    tableBody.innerHTML = ''; 

    if (forecasts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" style="text-align: center;">No weather data available</td>
        `;
        tableBody.appendChild(row);
        return;
    }

    forecasts.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const temperature = item.main.temp;
        const description = item.weather[0].description;
        const icon = item.weather[0].icon;
        const rainChance = item.pop * 100;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dateTime.toLocaleDateString()}</td>
            <td><img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}" /></td>
            <td>${temperature.toFixed(1)} °C</td>
            <td>${description.charAt(0).toUpperCase() + description.slice(1)}</td>
            <td>${rainChance.toFixed(0)}%</td>
        `;

        tableBody.appendChild(row);
    });
}


document.addEventListener("DOMContentLoaded", function () {
    // Hide main section initially
    const mainSection = document.getElementById("main");
    const weatherWidget = document.getElementById("weather-widget");
    const mapSection = document.getElementById("map");
    const barchart = document.getElementById("temp-bar-chart");
    const doughnutChart = document.getElementById("weather-doughnut-chart");
    const lineChart = document.getElementById("temp-line-chart");

    // Hide main, show others when page loads
    mainSection.style.display = "none";
    weatherWidget.style.display = "block";
    mapSection.style.display = "block";
    barchart.style.display = "block";
    doughnutChart.style.display = "block";
    lineChart.style.display = "block";

    // Get buttons from the sidebar
    const tableButton = document.getElementById("table");
    const dashboardButton = document.getElementById("dashboard");

    tableButton.addEventListener("click", function () {
      mainSection.style.display = "block"; 
      weatherWidget.style.display = "none"; 
      mapSection.style.display = "none"; 
      barchart.style.display = "none";
        doughnutChart.style.display = "none"; 
        lineChart.style.display = "none";
    });

    dashboardButton.addEventListener("click", function () {
      mainSection.style.display = "none"; 
      weatherWidget.style.display = "block"; 
      mapSection.style.display = "block"; 
      barchart.style.display = "block"; 
      doughnutChart.style.display = "block"; 
        lineChart.style.display = "block"; 

    });
  });