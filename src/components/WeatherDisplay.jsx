import { useState, useEffect, useCallback } from "react";
import cloudy from "../assets/icons/icon_cloudy.svg";
import foggy from "../assets/icons/icon_foggy.svg";
import rainy from "../assets/icons/icon_rainy.svg";
import snowy from "../assets/icons/icon_snowy.svg";
import sunny from "../assets/icons/icon_sunny.svg";
import thundery from "../assets/icons/icon_thundery.svg";
import windy from "../assets/icons/icon_windy.svg";

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
            console.log(fetchedData);
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

  const weatherIcons = {
    Clear: sunny,
    Clouds: cloudy,
    Squall: windy,
    Tornado: windy,
    Drizzle: rainy,
    Rain: rainy,
    Snow: snowy,
    Haze: foggy,
    Mist: foggy,
    Smoke: foggy,
    Dust: foggy,
    Fog: foggy,
    Sand: foggy,
    Ash: foggy,
    Thunderstorm: thundery,
  };

  const weatherIcon = weatherData.weather
    ? weatherIcons[weatherData.weather[0].main]
    : null;

  const weatherCondition = weatherData.weather
    ? weatherData.weather[0].main
    : null;

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
          <img
            className="weather__icon"
            src={weatherIcon}
            alt={weatherCondition}
          />
          <div className="weather__condition">{weatherCondition}</div>
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
