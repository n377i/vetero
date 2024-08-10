import { useState, useEffect, useCallback } from "react";
import loadingGif from "../assets/loading.gif";
import cloudsIcon from "../assets/icons/icon_clouds.svg";
import atmosphereIcon from "../assets/icons/icon_atmosphere.svg";
import moonIcon from "../assets/icons/icon_moon.svg";
import rainIcon from "../assets/icons/icon_rain.svg";
import snowIcon from "../assets/icons/icon_snow.svg";
import sunIcon from "../assets/icons/icon_sun.svg";
import thunderstormIcon from "../assets/icons/icon_thunderstorm.svg";
import windIcon from "../assets/icons/icon_wind.svg";
import cloudsImage from "../assets/images/img_clouds.jpg";
import atmosphereImage from "../assets/images/img_atmosphere.jpg";
import rainImage from "../assets/images/img_rain.jpg";
import snowImage from "../assets/images/img_snow.jpg";
import sunImage from "../assets/images/img_sun.jpg";
import thunderstormImage from "../assets/images/img_thunderstorm.jpg";
import windImage from "../assets/images/img_wind.jpg";

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const defaultCity = "Berlin";

  const fetchWeatherData = useCallback(
    async (city) => {
      if (city && city.trim() !== "") {
        setLoading(true);
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
        } finally {
          setLoading(false);
        }
      }
    },
    [apiKey]
  );

  useEffect(() => {
    const lastSearchedCity = localStorage.getItem("lastSearchedCity");
    fetchWeatherData(lastSearchedCity || defaultCity);
  }, [fetchWeatherData, defaultCity]);

  const isDaytime = useCallback(() => {
    if (!weatherData) return true;
    const currentTime = weatherData.dt;
    const sunriseTime = weatherData.sys.sunrise;
    const sunsetTime = weatherData.sys.sunset;

    return currentTime >= sunriseTime && currentTime < sunsetTime;
  }, [weatherData]);

  const daytime = isDaytime();

  useEffect(() => {
    if (daytime) {
      document.documentElement.style.setProperty("--primary", "#2d3349");
      document.documentElement.style.setProperty("--secondary", "#434656");
      document.documentElement.style.setProperty(
        "--temperature",
        "var(--temperature-day)"
      );
    } else {
      document.documentElement.style.setProperty("--primary", "#fafafa");
      document.documentElement.style.setProperty("--secondary", "#fff");
      document.documentElement.style.setProperty(
        "--temperature",
        "var(--temperature-night)"
      );
    }
  }, [daytime]);

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
    Clear: daytime ? sunIcon : moonIcon,
    Clouds: cloudsIcon,
    Squall: windIcon,
    Tornado: windIcon,
    Drizzle: rainIcon,
    Rain: rainIcon,
    Snow: snowIcon,
    Haze: atmosphereIcon,
    Mist: atmosphereIcon,
    Smoke: atmosphereIcon,
    Dust: atmosphereIcon,
    Fog: atmosphereIcon,
    Sand: atmosphereIcon,
    Ash: atmosphereIcon,
    Thunderstorm: thunderstormIcon,
  };

  const backgroundImages = {
    Clear: sunImage,
    Clouds: cloudsImage,
    Squall: windImage,
    Tornado: windImage,
    Drizzle: rainImage,
    Rain: rainImage,
    Snow: snowImage,
    Haze: atmosphereImage,
    Mist: atmosphereImage,
    Smoke: atmosphereImage,
    Dust: atmosphereImage,
    Fog: atmosphereImage,
    Sand: atmosphereImage,
    Ash: atmosphereImage,
    Thunderstorm: thunderstormImage,
  };

  const weatherIcon = weatherData?.weather
    ? weatherIcons[weatherData.weather[0].main]
    : null;
  const backgroundImage = weatherData?.weather
    ? backgroundImages[weatherData.weather[0].main]
    : cloudsImage;
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
      {!daytime ? <div className="overlay"></div> : null}
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
        {loading ? (
          <img className="loader" src={loadingGif} alt="loading" />
        ) : noResults ? (
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
