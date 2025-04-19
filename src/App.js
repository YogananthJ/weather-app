import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Create refs for each section
  const homeRef = useRef(null);
  const weatherRef = useRef(null);
  const contactRef = useRef(null);
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Scroll to section function
  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth'
    });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">Weather App</div>
          <ul className="nav-menu">
            <li className="nav-item">
              <button onClick={() => scrollToSection(homeRef)}>Home</button>
            </li>
            <li className="nav-item">
              <button onClick={() => scrollToSection(weatherRef)}>Weather</button>
            </li>
            <li className="nav-item">
              <button onClick={() => scrollToSection(contactRef)}>Contact</button>
            </li>
            <li className="nav-item">
              <button className="mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? '🌝' : '🌚'}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Home Section */}
        <section ref={homeRef} className="section home-section">
          <div className="home-container">
            <div className="home-content">
              <div className="home-left">
                <img 
                  src="/images/home-illustration-removebg-preview.png" 
                  alt="Illustration" 
                  className="home-illustration" 
                />
              </div>
              <div className="home-right">
                <h2>What We Do</h2>
                <p>
                  We provide innovative solutions to modern problems. Our team of experts 
                  works tirelessly to deliver high-quality services in web development, 
                  weather data analysis, and customer support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Weather Section */}
        <section ref={weatherRef} className="section weather-section">
          <Weather darkMode={darkMode} />
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="section contact-section">
          <Contact darkMode={darkMode} />
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>© {new Date().getFullYear()} Weather App. All rights reserved.</p>
            <p className="designer-credit">Designed by Yogananth</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Weather Component
const Weather = ({ darkMode }) => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&units=metric&appid=${apiKey}`
      );
      setWeatherData(response.data);
    } catch (err) {
      setWeatherData(null);
      setError(err.response?.status === 404 
        ? 'City not found. Please try again.' 
        : 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-section">
      <div className="weather-container">
        <h2 className="section-title">Weather Forecast</h2>
        
        <div className="weather-content">
          {/* Left Side - Search Form */}
          <div className="weather-form-container">
            <div className="weather-form-card">
              <h3>Search Location</h3>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
                />
                <button 
                  onClick={fetchWeather}
                  disabled={loading}
                  className={loading ? 'loading' : ''}
                >
                  {loading ? (
                    <span className="loader"></span>
                  ) : (
                    <>
                      <i className="search-icon"></i> Search
                    </>
                  )}
                </button>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="weather-tips">
                <h4>Search Tips:</h4>
                <ul>
                  <li>Include country code for accuracy (e.g., "London, UK")</li>
                  <li>Check your spelling</li>
                  <li>Major cities work best</li>
                  <li>Make sure Internet is connected</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right Side - Results */}
          <div className="weather-results-container">
            {weatherData ? (
              <div className="weather-results-card">
                <div className="weather-header">
                  <h3>
                    {weatherData.name}, {weatherData.sys.country}
                  </h3>
                  <p className="weather-description">
                    {weatherData.weather[0].description}
                  </p>
                </div>
                
                <div className="weather-main">
                  <div className="temperature">
                    {Math.round(weatherData.main.temp)}°C
                  </div>
                  <div className="weather-icon">
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                      alt={weatherData.weather[0].description}
                    />
                  </div>
                </div>
                
                <div className="weather-details">
                  <div className="detail-item">
                    <span className="detail-label">Feels Like</span>
                    <span className="detail-value">
                      {Math.round(weatherData.main.feels_like)}°C
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">
                      {weatherData.main.humidity}%
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Wind</span>
                    <span className="detail-value">
                      {weatherData.wind.speed} m/s
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Pressure</span>
                    <span className="detail-value">
                      {weatherData.main.pressure} hPa
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="weather-placeholder">
                <div className="placeholder-icon">🌤️</div>
                <h3>Weather Data</h3>
                <p>Search for a city to view current weather conditions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Component
const Contact = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! We'll contact you soon.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-left">
          <img 
            src="/images/5124556.png" 
            alt="Contact Illustration" 
            className="contact-image"
          />
        </div>
        <div className="contact-right">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;