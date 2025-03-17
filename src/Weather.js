import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [time, setTime] = useState(new Date());

  // Live Clock Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Weather Data
  const fetchWeather = async () => {
    if (!city) return;
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&units=metric&appid=${apiKey}`
      );
      setWeatherData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('City not found! Please enter a valid city name.');
      } else {
        alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="App">
      <div className="weather-container">
        <h1>Weather App</h1>

        {/* Weather Info Section */}
        {weatherData && (
          <div className="weather-info-bar">
          
            <p>📅{time.toLocaleString()}</p>
            <p>☀️ {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>🌙 {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
            <button onClick={fetchWeather}>🔄 Refresh</button>
          </div>
        )}

        {/* Search Input & Button */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <button onClick={fetchWeather}>Get Weather</button>

        {/* Weather Details */}
        {weatherData && (
          <>
            <h2>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p>{weatherData.weather[0].description}</p>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Feels like: {weatherData.main.feels_like}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
