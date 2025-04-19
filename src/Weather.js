import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';


const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="weather-page">
      <div className="weather-container">
        <h1>Weather App</h1>

        {weatherData && (
          <div className="weather-info-bar">
            <p>📅 {time.toLocaleString()}</p>
            <p>☀️ {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>🌙 {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
            <button onClick={fetchWeather}>🔄 Refresh</button>
          </div>
        )}

        <div className="input-button-group">
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather}>Get Weather</button>
        </div>

        {weatherData && (
          <div className="weather-details">
            <h2>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p>{weatherData.weather[0].description}</p>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Feels like: {weatherData.main.feels_like}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;