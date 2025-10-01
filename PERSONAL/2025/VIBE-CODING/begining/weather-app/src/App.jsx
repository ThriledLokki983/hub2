import { useState } from 'react';
import './App.css';

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (loc) => {
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const response = await fetch(`${WEATHER_API_URL}?q=${loc}&appid=${apiKey}&units=metric`);
      if (!response.ok) throw new Error('Location not found');
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location) fetchWeather(location);
  };

  const handleGeolocation = () => {
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const { latitude, longitude } = pos.coords;
        const response = await fetch(`${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('Location not found');
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, () => {
      setError('Unable to retrieve your location');
      setLoading(false);
    });
  };

  return (
    <>
      <div className="weather-app-animated-bg">
        <div className="weather-bg-bubble weather-bg-bubble1" />
        <div className="weather-bg-bubble weather-bg-bubble2" />
        <div className="weather-bg-bubble weather-bg-bubble3" />
        <div className="weather-bg-bubble weather-bg-bubble4" />
      </div>
      <div className="weather-app-container">
        <h1 className="weather-title">Weather App</h1>
        <form onSubmit={handleSubmit} className="weather-form">
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Enter location"
            className="weather-input"
          />
          <button type="submit" className="weather-btn weather-btn-search">Search</button>
          <button type="button" onClick={handleGeolocation} className="weather-btn weather-btn-geo">Use My Location</button>
        </form>
        {loading && <div className="weather-loading">Loading...</div>}
        {error && <div className="weather-error">{error}</div>}
        {weather && (
          <div className="weather-result">
            <h2 className="weather-location">{weather.name}, {weather.sys.country}</h2>
            <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
            <div className="weather-desc">{weather.weather[0].description}</div>
            <div className="weather-humidity">Humidity: {weather.main.humidity}%</div>
            <div className="weather-wind">Wind: {Math.round(weather.wind.speed)} m/s</div>
          </div>
        )}
      </div>
    </>
  );
}

export default WeatherApp;
