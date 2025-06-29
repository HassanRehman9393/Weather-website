const chatToggle = document.getElementById('chatToggle');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

chatToggle.addEventListener('click', () => {
    if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
        chatContainer.style.display = 'flex';
        chatToggle.innerHTML = '&times;';
    } else {
        chatContainer.style.display = 'none';
        chatToggle.innerHTML = '💬';
    }
});

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true); 
        userInput.value = '';
        if (isWeatherRelated(message)) {
            handleWeatherQuery(message);
        } else {
            setTimeout(() => {
                fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC0jbl5Fu0bRVmWXlE6DCGV-jfGtC7qg7A`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: message
                                    }
                                ]
                            }
                        ]
                    })
                })
                .then(response => response.json())
                .then(data => {
                    const botResponse = data.candidates[0].content.parts[0].text;
                    addMessage(botResponse);
                })
                .catch(error => {
                    addMessage('Sorry, I encountered an error. Please try again.');
                    console.error('Error:', error);
                });
            }, 1000);
        }
    }
}

// Function to check if the message is related to weather
function isWeatherRelated(message) {
    const weatherKeywords = ['highest temperature', 'lowest temperature', 'rain', 'forecast', 'temperature', 'weather'];
    return weatherKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

// Function to handle weather-related queries
function handleWeatherQuery(message) {
    let response = '';

    if (message.toLowerCase().includes('highest temperature')) {
        const highestTemp = allForecasts.reduce((max, forecast) => 
            forecast.main.temp > max.main.temp ? forecast : max
        );
        response = `The highest temperature today is ${highestTemp.main.temp}°C at ${new Date(highestTemp.dt_txt).toLocaleTimeString()}.`;
    } else if (message.toLowerCase().includes('lowest temperature')) {
        const lowestTemp = allForecasts.reduce((min, forecast) => 
            forecast.main.temp < min.main.temp ? forecast : min
        );
        response = `The lowest temperature today is ${lowestTemp.main.temp}°C at ${new Date(lowestTemp.dt_txt).toLocaleTimeString()}.`;
    } else if (message.toLowerCase().includes('rain')) {
        const rainForecasts = allForecasts.filter(forecast => forecast.pop > 0);
        if (rainForecasts.length > 0) {
            response = `It will rain at the following times: ${rainForecasts.map(forecast => new Date(forecast.dt_txt).toLocaleTimeString()).join(', ')}`;
        } else {
            response = 'No rain is expected today.';
        }
    } else if (message.toLowerCase().includes('temperature')) {
        const currentTemp = allForecasts[0].main.temp; 
        response = `The current temperature is ${currentTemp}°C.`;
    } else if (message.toLowerCase().includes('forecast')) {
        response = `The weather forecast includes temperatures ranging from ${Math.min(...allForecasts.map(f => f.main.temp))}°C to ${Math.max(...allForecasts.map(f => f.main.temp))}°C today.`;
    } else if (message.toLowerCase().includes('current weather')) {
        const currentForecast = allForecasts[0]; 
        const currentTemp = currentForecast.main.temp;
        const weatherDescription = currentForecast.weather[0].description;
        const currentTime = new Date(currentForecast.dt_txt).toLocaleTimeString();
        response = `The current weather is ${currentTemp}°C with ${weatherDescription} at ${currentTime}.`;
    } else {
        response = "I'm not sure how to respond to that weather-related query.";
    }

    addMessage(response); 
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
