# SkyForecast Weather App

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Setup and Installation](#setup-and-installation)
5. [Detailed Usage Guide](#detailed-usage-guide)
6. [Project Structure](#project-structure)
7. [API Integration](#api-integration)
8. [Customization Options](#customization-options)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)
12. [License](#license)
13. [Acknowledgments](#acknowledgments)

## Introduction

SkyForecast is a state-of-the-art weather application designed to provide users with comprehensive weather information, forecasts, and interactive features. Built with modern web technologies, SkyForecast offers a seamless and engaging user experience across devices.

## Features

### 1. Dynamic Weather Display
- *Current Weather*: Real-time weather information based on user's location or searched city.
- *5-Day Forecast*: Detailed weather predictions for the upcoming 5 days.
- *Hourly Forecast*: Breakdown of weather conditions at 5-hour intervals.

### 2. Interactive Map
- Powered by Leaflet.js for smooth navigation and location selection.
- Automatic map centering based on searched location or user's current position.
- Custom markers indicating weather conditions at different locations.

### 3. Data Visualization
- *Temperature Bar Chart*: Displays temperature trends over time.
- *Weather Condition Doughnut Chart*: Shows distribution of different weather conditions.
- *Temperature Line Chart*: Illustrates temperature variations across days.

### 4. Customizable User Interface
- *Theme Toggle*: Switch between dark and light themes for comfortable viewing in any lighting condition.
- *Temperature Unit Switch*: Easy toggle between Celsius and Fahrenheit.

### 5. Detailed Weather Table
- Comprehensive 5-day forecast with 5-hour interval data.
- Advanced filtering and sorting options:
  - Ascending/Descending temperature order
  - Filter for rainy days
  - Highlight days with highest temperatures

### 6. AI-Powered Chatbot
- Integrated Google Gemini chatbot for natural language weather queries.
- Provides weather-related advice and additional information.

### 7. Responsive Design
- Seamless experience across desktop, tablet, and mobile devices.

## Technologies Used

- *Frontend*: HTML5, CSS3, JavaScript (ES6+)
- *Mapping*: Leaflet.js
- *Data Visualization*: Chart.js
- *Icons*: Font Awesome
- *AI Integration*: Google Gemini API
- *API Requests*: Fetch API
- *Styling*: Custom CSS with flexbox and grid layouts
- *Version Control*: Git

## Setup and Installation

1. *Clone the Repository*
   
   git clone https://github.com/your-username/skyforecast.git
   

2. *Navigate to Project Directory*
   
   cd skyforecast
   

3. *Install Dependencies* (if using npm)
   
   npm install
   

4. *Configure API Keys*
   - Rename config.example.js to config.js
   - Add your API keys for weather data and Google Gemini

5. *Launch the Application*
   - For development: Use a local server like Live Server in VS Code
   - For production: Deploy to your preferred hosting service

## Detailed Usage Guide

### Current Weather
1. Allow location access for automatic weather data, or
2. Use the search bar to enter a city name
3. View detailed current weather information in the main widget

### Interactive Map
1. Click on any location on the map to get weather data
2. The map automatically centers on searched locations
3. Custom markers indicate general weather conditions

### Data Visualization
1. Scroll down to view various charts
2. Hover over chart elements for detailed information
3. Use chart controls (if available) to zoom or pan

### Theme and Units
1. Click the sun/moon icon in the header to toggle theme
2. Use the temperature switch to change between °C and °F

### Detailed Forecast Table
1. Navigate to the table view
2. Use dropdown filters to sort and filter data:
   - Ascending/Descending temperature
   - Show only rainy days
   - Display highest temperature day

### Chatbot
1. Click the chat icon to open the chatbot interface
2. Type natural language queries about weather
3. Receive AI-generated responses and weather advice

## Project Structure
```bash
skyforecast/
│
├── index.html
├── README.md
├── LICENSE.md
│
├── stylesheets/
│   ├── style.css
│   ├── stars.css
│   ├── sidebar.css
│   ├── charts.css
│   ├── table.css
│   ├── chatbot.css
│   └── widget.css
│
├── scripts/
│   ├── index.js
│   └── chatbot.js
│
├── images/
│   ├── image.png
│   ├── user.png
│   └── sun.png
│
└── config.js
```

## API Integration

SkyForecast integrates with external APIs for weather data and AI functionality:

1. *Weather API*: [Specify your weather API provider]
   - Endpoints used:
     - Current weather
     - 5-day forecast
     - Geocoding for location search

2. *Google Gemini API*:
   - Used for natural language processing in the chatbot feature
   - Handles weather-related queries and provides intelligent responses

## Customization Options

1. *Themes*: Modify stylesheets/style.css to adjust color schemes
2. *Charts*: Customize chart options in scripts/index.js
3. *Weather Icons*: Add or modify weather icons in the images/ directory

## Performance Optimization

- Lazy loading of images and non-critical CSS
- Minification of CSS and JavaScript files for production
- Use of efficient data structures for handling large datasets
- Caching of weather data to reduce API calls

## Troubleshooting

Common issues and solutions:
1. *Weather data not loading*: Check API key and network connection
2. *Map not displaying*: Ensure Leaflet.js is properly loaded
3. *Chatbot not responding*: Verify Google Gemini API integration

For more issues, please check the [Issues](https://github.com/your-username/skyforecast/issues) section of our GitHub repository.

## Contributing

We welcome contributions to SkyForecast! Here's how you can help:

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Weather data provided by [Your Weather API Provider]
- Icons by Font Awesome
- Mapping functionality powered by Leaflet.js
- Charts rendered using Chart.js
- AI chatbot powered by Google Gemini
- Special thanks to all contributors and supporters of the project

---

For any additional information, feature requests, or bug reports, please open an issue in the GitHub repository or contact the maintainers directly.
