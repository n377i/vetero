import { useState, useEffect, useCallback } from "react";
import cloudyIcon from "../assets/icons/icon_cloudy.svg";
import foggyIcon from "../assets/icons/icon_foggy.svg";
import rainyIcon from "../assets/icons/icon_rainy.svg";
import snowyIcon from "../assets/icons/icon_snowy.svg";
import sunnyIcon from "../assets/icons/icon_sunny.svg";
import thunderyIcon from "../assets/icons/icon_thundery.svg";
import windyIcon from "../assets/icons/icon_windy.svg";
import cloudyImage from "../assets/images/img_cloudy.jpg";
import foggyImage from "../assets/images/img_foggy.jpg";
import rainyImage from "../assets/images/img_rainy.jpg";
import snowyImage from "../assets/images/img_snowy.jpg";
import sunnyImage from "../assets/images/img_sunny.jpg";
import thunderyImage from "../assets/images/img_thundery.jpg";
import windyImage from "../assets/images/img_windy.jpg";

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [noResults, setNoResults] = useState(false);
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
            setNoResults(false);
            localStorage.setItem("lastSearchedCity", city);
          } else {
            setWeatherData(null);
            setNoResults(true);
          }
        } catch (error) {
          console.error("Error fetching weather:", error);
          setWeatherData(null);
          setNoResults(true);
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
    Clear: sunnyIcon,
    Clouds: cloudyIcon,
    Squall: windyIcon,
    Tornado: windyIcon,
    Drizzle: rainyIcon,
    Rain: rainyIcon,
    Snow: snowyIcon,
    Haze: foggyIcon,
    Mist: foggyIcon,
    Smoke: foggyIcon,
    Dust: foggyIcon,
    Fog: foggyIcon,
    Sand: foggyIcon,
    Ash: foggyIcon,
    Thunderstorm: thunderyIcon,
  };

  const weatherIcon = weatherData?.weather
    ? weatherIcons[weatherData.weather[0].main]
    : null;

  const backgroundImages = {
    Clear: sunnyImage,
    Clouds: cloudyImage,
    Squall: windyImage,
    Tornado: windyImage,
    Drizzle: rainyImage,
    Rain: rainyImage,
    Snow: snowyImage,
    Haze: foggyImage,
    Mist: foggyImage,
    Smoke: foggyImage,
    Dust: foggyImage,
    Fog: foggyImage,
    Sand: foggyImage,
    Ash: foggyImage,
    Thunderstorm: thunderyImage,
  };

  const backgroundImage = weatherData?.weather
    ? backgroundImages[weatherData.weather[0].main]
    : "src/assets/images/img_cloudy.jpg";

  const weatherCondition = weatherData?.weather
    ? weatherData.weather[0].main
    : null;

  const date = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();

  const currentDate = `${dayOfWeek}, ${month} ${dayOfMonth}`;

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="app">
        <div className="search">
          {weatherData?.name ? (
            <div className="search__top">
              <i className="search__icon-location fa-solid fa-location-dot"></i>
              <div className="location">{weatherData.name}</div>
            </div>
          ) : null}
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
        {noResults ? (
          <div className="no-results">
            <i className="no-results__icon fa-solid fa-magnifying-glass"></i>
            <p>No results found.</p>
          </div>
        ) : (
          <>
            <div className="weather">
              <img
                className="weather__icon"
                src={weatherIcon}
                alt={weatherCondition}
              />
              <div className="weather__condition">{weatherCondition}</div>
              <div className="weather__temperature">
                {weatherData?.main
                  ? `${Math.floor(weatherData.main.temp)}°`
                  : null}
              </div>
            </div>
            <div className="date">
              <p>{currentDate}</p>
            </div>
            <div className="data">
              <div className="data__item data__item--humidity">
                <div className="data__name">Humidity</div>
                <i className="data__icon fa-solid fa-droplet"></i>
                <div className="data__value">
                  {weatherData?.main ? weatherData.main.humidity : null} %
                </div>
              </div>
              <div className="data__item data__item--wind">
                <div className="data__name">Wind</div>
                <i className="data__icon fa-solid fa-wind"></i>
                <div className="data__value">
                  {weatherData?.wind ? weatherData.wind.speed : null} km/h
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherDisplay;
