import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample Coordinates (replace with your real data)
  const coordinates = {
    "Andhra Pradesh": {
      "Anantapur": { "Anantapur": { latitude: 14.6819, longitude: 77.6006 } },
      // Add more districts and cities
    },
    "Ladakh": {
      "Leh": { latitude: 34.1526, longitude: 77.5789 },
      "Kargil": { latitude: 34.5511, longitude: 76.1324 },
    }
  };

  const getWeather = async () => {
    const coord = coordinates[state]?.[district]?.[city];
    if (!coord) {
      setError("Invalid location selected.");
      return;
    }

    const { latitude, longitude } = coord;
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`
      );
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
        setIsModalOpen(true);
        setError('');
      } else {
        setError("Failed to fetch weather data.");
      }
    } catch (error) {
      setError("An error occurred while fetching weather data.");
    }
  };

  const handleFeedbackSubmit = () => {
    alert('Feedback Submitted: ' + feedback);
    setFeedback('');
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Weather App</h1>

        <div className="dropdown-container">
          <select onChange={(e) => setState(e.target.value)}>
            <option>Select State</option>
            {Object.keys(coordinates).map((st) => (
              <option key={st}>{st}</option>
            ))}
          </select>

          <select onChange={(e) => setDistrict(e.target.value)} disabled={!state}>
            <option>Select District</option>
            {state &&
              Object.keys(coordinates[state] || {}).map((dist) => (
                <option key={dist}>{dist}</option>
              ))}
          </select>

          <select onChange={(e) => setCity(e.target.value)} disabled={!district}>
            <option>Select City</option>
            {district &&
              Object.keys(coordinates[state]?.[district] || {}).map((ct) => (
                <option key={ct}>{ct}</option>
              ))}
          </select>

          <button onClick={getWeather}>Get Weather</button>
        </div>
      </nav>

      {error && <div className="error">{error}</div>}

      {weather && isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Weather for {city}, {district}, {state}</h2>
            <p>Temperature: {weather.current_weather.temperature}°C</p>
            <p>Wind Speed: {weather.current_weather.windspeed} km/h</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="feedback-section">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Submit your feedback"
        ></textarea>
        <button onClick={handleFeedbackSubmit}>Submit Feedback</button>
      </div>
    </div>
  );
};

export default App;
