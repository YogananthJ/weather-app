import React from 'react';
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightCloudy,
  WiCloudy,
  WiRain,
  WiSnow,
  WiSleet,
  WiStrongWind,
  WiFog,
  WiSunrise,
  WiSunset,
  WiTime3
} from 'react-icons/wi';
import { FiClock } from 'react-icons/fi';

const WeatherIcon = ({ type, color = 'currentColor', size = 64 }) => {
  const iconMap = {
    'CLEAR_DAY': <WiDaySunny color={color} size={size} />,
    'CLEAR_NIGHT': <WiNightClear color={color} size={size} />,
    'PARTLY_CLOUDY_DAY': <WiDayCloudy color={color} size={size} />,
    'PARTLY_CLOUDY_NIGHT': <WiNightCloudy color={color} size={size} />,
    'CLOUDY': <WiCloudy color={color} size={size} />,
    'RAIN': <WiRain color={color} size={size} />,
    'SNOW': <WiSnow color={color} size={size} />,
    'SLEET': <WiSleet color={color} size={size} />,
    'WIND': <WiStrongWind color={color} size={size} />,
    'FOG': <WiFog color={color} size={size} />,
    'SUNRISE': <WiSunrise color={color} size={size} />,
    'SUNSET': <WiSunset color={color} size={size} />,
    'ACCESS_TIME': <FiClock color={color} size={size} />,
    'TIME': <WiTime3 color={color} size={size} />
  };

  return iconMap[type] || <WiDayCloudy color={color} size={size} />;
};

export default WeatherIcon;