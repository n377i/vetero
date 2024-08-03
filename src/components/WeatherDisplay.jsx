import { useState, useEffect, useCallback } from "react";
import sunny from "../assets/icons/icon_sun.svg";

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState({});
  const [location, setLocation] = useState("");
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const defaultCity = "Berlin";

  const fetchWeatherData = useCallback(
    async (city) => {
      if (city && city.trim() !== "") {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${apiKey}`;
        try {
          const response = await fetch(url);
          if (response.ok) {
            const fetchedData = await response.json();
            setWeatherData(fetchedData);
            localStorage.setItem("lastSearchedCity", city);
          } else {
            console.error("Network error");
          }
        } catch (error) {
          console.error("Error fetching weather:", error);
        }
      }
    },
    [apiKey]
  );

  useEffect(() => {
    const lastSearchedCity = localStorage.getItem("lastSearchedCity");
    fetchWeatherData(lastSearchedCity || defaultCity);
  }, [fetchWeatherData, defaultCity]);

  const handleInputChange = (event) => {
    setLocation(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchWeatherData(location);
      setLocation("");
    }
  };

  const handleSearchClick = () => {
    fetchWeatherData(location);
    setLocation("");
  };

  return (
    <div className="container">
      <div className="app">
        <div className="search">
          <div className="search__top">
            <i className="search__icon-location fa-solid fa-location-dot"></i>
            <div className="location">{weatherData.name}</div>
          </div>
          <div className="search__bar">
            <input
              className="search__input"
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <i
              className="search__icon-search fa-solid fa-magnifying-glass"
              onClick={handleSearchClick}
            ></i>
          </div>
        </div>
        <div className="weather">
          <img className="weather__icon" src={sunny} alt="sunny" />
          <div className="weather__type">
            {weatherData.weather ? weatherData.weather[0].main : null}
          </div>
          <div className="weather__temperature">
            {weatherData.main ? `${Math.floor(weatherData.main.temp)}°` : null}
          </div>
        </div>
        <div className="date">
          <p>Wednesday, July 31</p>
        </div>
        <div className="data">
          <div className="data__item data__item--humidity">
            <div className="data__name">Humidity</div>
            <i className="data__icon fa-solid fa-droplet"></i>
            <div className="data__value">
              {weatherData.main ? weatherData.main.humidity : null} %
            </div>
          </div>
          <div className="data__item data__item--wind">
            <div className="data__name">Wind</div>
            <i className="data__icon fa-solid fa-wind"></i>
            <div className="data__value">
              {weatherData.wind ? weatherData.wind.speed : null} km/h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
