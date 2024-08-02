import sunny from "../assets/icons/icon_sun.svg";

const WeatherDisplay = () => {
  return (
    <div className="container">
      <div className="app">
        <div className="search">
          <div className="search__top">
            <i className="search__icon-location fa-solid fa-location-dot"></i>
            <div className="location">Kiel</div>
          </div>
          <div className="search__bar">
            <input
              className="search__input"
              type="text"
              placeholder="Enter location"
            />
            <i className="search__icon-search fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
        <div className="weather">
          <img className="weather__icon" src={sunny} alt="sunny" />
          <div className="weather__type">Clear</div>
          <div className="weather__temperature">24°</div>
        </div>
        <div className="date">
          <p>Wednesday, July 31</p>
        </div>
        <div className="data">
          <div className="data__item data__item--humidity">
            <div className="data__name">Humidity</div>
            <i className="data__icon fa-solid fa-droplet"></i>
            <div className="data__value">35 %</div>
          </div>
          <div className="data__item data__item--wind">
            <div className="data__name">Wind</div>
            <i className="data__icon fa-solid fa-wind"></i>
            <div className="data__value">4 km/h</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
