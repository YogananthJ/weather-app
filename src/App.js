import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import WeatherIcon from './WeatherIcon';
import './App.css';

function App() {
  const homeRef = useRef(null);
  const weatherRef = useRef(null);
  const contactRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [searchHistory, setSearchHistory] = useState(JSON.parse(localStorage.getItem('searchHistory')) || []);

  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth',
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const addToFavorites = (city) => {
    if (!favorites.includes(city)) {
      const updated = [...favorites, city];
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    }
  };

  const removeFromFavorites = (city) => {
    const updated = favorites.filter(f => f !== city);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
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
              <FavoritesDropdown 
                favorites={favorites}
                remove={removeFromFavorites}
                scroll={scrollToSection}
                weatherRef={weatherRef}
              />
            </li>
            <li className="nav-item">
              <button className="mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? '🌝' : '🌚'}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
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

        <section ref={weatherRef} className="section weather-section">
          <Weather 
            darkMode={darkMode}
            favorites={favorites}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            searchHistory={searchHistory}
            setSearchHistory={setSearchHistory}
          />
        </section>

        <section ref={contactRef} className="section contact-section">
          <Contact darkMode={darkMode} />
        </section>
      </main>

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

const FavoritesDropdown = ({ favorites, remove, scroll, weatherRef }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="favorites-dropdown">
      <button onClick={() => setShowDropdown(!showDropdown)}>
        Favorites ({favorites.length})
      </button>
      {showDropdown && (
        <ul className="dropdown-list">
          {favorites.map((city, index) => (
            <li key={index}>
              <span>{city}</span>
              <div className="dropdown-actions">
                <button 
                  onClick={() => {
                    scroll(weatherRef);
                    document.dispatchEvent(new CustomEvent('searchCity', {
                      detail: city
                    }));
                    setShowDropdown(false);
                  }}
                >
                  🔍
                </button>
                <button onClick={() => remove(city)}>❌</button>
              </div>
            </li>
          ))}
          {favorites.length === 0 && (
            <li className="no-favorites">No favorites added</li>
          )}
        </ul>
      )}
    </div>
  );
};

const Weather = ({ darkMode, favorites, addToFavorites, removeFromFavorites, searchHistory, setSearchHistory }) => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [weatherTip, setWeatherTip] = useState('');

  useEffect(() => {
    const handler = (e) => {
      setCity(e.detail);
      fetchWeather(e.detail);
    };
    document.addEventListener('searchCity', handler);
    return () => document.removeEventListener('searchCity', handler);
  }, []);

  useEffect(() => {
    let interval;
    if (weatherData) {
      updateLocalTime();
      interval = setInterval(updateLocalTime, 1000);
    }
    return () => clearInterval(interval);
  }, [weatherData]);

  const updateLocalTime = () => {
    if (!weatherData) return;
    const offset = weatherData.timezone / 3600;
    const localDate = new Date(Date.now() + (offset * 3600 * 1000));
    setLocalTime(localDate.toLocaleTimeString());
  };

  const fetchWeather = async (searchCity = city) => {
    if (!searchCity.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity.trim()}&units=metric&appid=${apiKey}`
      );
      
      setWeatherData(data);
      updateSearchHistory(searchCity.trim());
      generateWeatherTips(data);
    } catch (err) {
      setWeatherData(null);
      setError(err.response?.status === 404 ? 'City not found. Please try again.' : 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const updateSearchHistory = (city) => {
    const updated = Array.from(new Set([city, ...searchHistory])).slice(0, 5);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  const generateWeatherTips = (data) => {
    const weather = data.weather[0].main.toLowerCase();
    let tip = '';
    
    if (weather.includes('rain')) tip = "☔ Carry an umbrella today!";
    else if (weather.includes('cloud')) tip = "⛅ You might need a light jacket";
    else if (weather.includes('clear')) tip = "😎 Perfect day for outdoor activities!";
    else if (weather.includes('snow')) tip = "⛄️ Bundle up and watch for icy roads";
    
    setWeatherTip(tip);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
          const { data } = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`
          );
          setCity(data.name);
          setWeatherData(data);
          updateSearchHistory(data.name);
          generateWeatherTips(data);
        } catch (err) {
          setError('Failed to fetch weather for your location');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const getSkyconType = (condition) => {
    const icon = condition.toUpperCase();
    switch (icon) {
      case 'CLEAR': return 'CLEAR_DAY';
      case 'CLOUDS': return 'CLOUDY';
      case 'RAIN': return 'RAIN';
      case 'SNOW': return 'SNOW';
      case 'SLEET': return 'SLEET';
      case 'WIND': return 'WIND';
      case 'FOG': return 'FOG';
      case 'PARTLY_CLOUDY': return 'PARTLY_CLOUDY_DAY';
      default: return 'PARTLY_CLOUDY_DAY';
    }
  };

  return (
    <div className="weather-section">
      <div className="weather-container">
        <h2 className="section-title">Weather Forecast</h2>
        
        <div className="weather-content">
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
                <button onClick={() => fetchWeather()} disabled={loading}>
                  {loading ? <div className="loader"></div> : 'Search'}
                </button>
              </div>
              
              <button className="location-btn" onClick={getLocation}>
                📍 Use My Location
              </button>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="weather-tips">
                <h4>Search Tips:</h4>
                <ul>
                  <li>Include country code for accuracy (e.g., "London, UK")</li>
                  <li>Check your spelling</li>
                  <li>Major cities work best</li>
                </ul>
              </div>
            </div>
            
            {searchHistory.length > 0 && (
              <div className="search-history">
                <h4>Recent Searches:</h4>
                <div className="history-items">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      className="history-item"
                      onClick={() => {
                        setCity(item);
                        fetchWeather(item);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="weather-results-container">
            {weatherData ? (
              <div className="weather-results-card">
                <div className="weather-header">
                  <h3>
                    {weatherData.name}, {weatherData.sys.country}
                    <button 
                      className={`favorite-btn ${favorites.includes(weatherData.name) ? 'active' : ''}`}
                      onClick={() => favorites.includes(weatherData.name) 
                        ? removeFromFavorites(weatherData.name) 
                        : addToFavorites(weatherData.name)
                      }
                    >
                      {favorites.includes(weatherData.name) ? '★' : '☆'}
                    </button>
                  </h3>
                  <p className="weather-description">
                    {weatherData.weather[0].description}
                  </p>
                </div>
                
                <div className="time-info">
                  <WeatherIcon type="ACCESS_TIME" color={darkMode ? 'white' : 'black'} />
                  <span>Local Time: {localTime}</span>
                </div>
                
                {weatherTip && <div className="weather-tip">{weatherTip}</div>}
                
                <div className="weather-main">
                  <div className="temperature">
                    {Math.round(weatherData.main.temp)}°C
                  </div>
                  <div className="weather-icon">
                    <WeatherIcon
                      type={getSkyconType(weatherData.weather[0].main)}
                      color={darkMode ? 'white' : 'black'}
                    />
                  </div>
                </div>
                
                <div className="astro-info">
                  <div className="astro-item">
                    <WeatherIcon type="SUNRISE" color="gold" />
                    <span>Sunrise: {formatTime(weatherData.sys.sunrise)}</span>
                  </div>
                  <div className="astro-item">
                    <WeatherIcon type="SUNSET" color="orange" />
                    <span>Sunset: {formatTime(weatherData.sys.sunset)}</span>
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
                    <span className="detail-value">{weatherData.main.humidity}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Wind</span>
                    <span className="detail-value">{weatherData.wind.speed} m/s</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Pressure</span>
                    <span className="detail-value">{weatherData.main.pressure} hPa</span>
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

const Contact = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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