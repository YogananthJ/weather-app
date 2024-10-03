import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

// Set Mapbox access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Get from Mapbox

function Mapbox() {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize Mapbox map
    const initializeMap = ({ setMap, mapboxgl }) => {
      const map = new mapboxgl.Map({
        container: 'mapbox-weather',
        style: 'mapbox://styles/mapbox/light-v10', // Choose your map style
        center: [78.9629, 20.5937], // India coordinates
        zoom: 4,
      });

      // Fetch real-time weather data from OpenWeatherMap
      map.on('load', () => {
        fetchWeatherData(map);
        setMap(map);
      });
    };

    if (!map) initializeMap({ setMap, mapboxgl });

    return () => map && map.remove();
  }, [map]);

  const fetchWeatherData = async (map) => {
    try {
      // Fetch real-time weather data from OpenWeatherMap
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=YOUR_OPENWEATHERMAP_API_KEY`
      );

      const { coord, weather } = weatherResponse.data;
      const weatherIcon = weather[0].icon;
      const lat = coord.lat;
      const lon = coord.lon;

      // Add weather marker to the map
      new mapboxgl.Marker({ color: 'blue' })
        .setLngLat([lon, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>Weather: ${weather[0].description}</h3>
        <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="weather icon">`))
        .addTo(map);
    } catch (error) {
      console.error('Error fetching weather data', error);
    }
  };

  return <div id="mapbox-weather" style={{ height: '600px', width: '100%' }} />;
}

export default Mapbox;
