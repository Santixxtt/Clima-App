import {
  WiHumidity,
  WiThermometer,
  WiStrongWind,
  WiSunrise,
  WiSunset,
} from "react-icons/wi";

function WeatherCard({ weather }) {
  const { name, main, weather: details, wind, sys } = weather;
  const icon = `https://openweathermap.org/img/wn/${details[0].icon}@2x.png`;

  function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="weather-card">
      <div className="weather-card__header">
        <h2>{name}, {sys.country}</h2>
        <img src={icon} alt={details[0].description} />
      </div>

      <p className="weather-card__temp">{Math.round(main.temp)}°C</p>
      <p className="weather-card__desc">{details[0].description}</p>

      <div className="weather-card__details">
        <div className="detail-item">
          <WiHumidity size={28} />
          <span>{main.humidity}%</span>
          <small>Humedad</small>
        </div>
        <div className="detail-item">
          <WiThermometer size={28} />
          <span>{Math.round(main.feels_like)}°C</span>
          <small>Sensación</small>
        </div>
        <div className="detail-item">
          <WiStrongWind size={28} />
          <span>{Math.round(wind.speed * 3.6)} km/h</span>
          <small>Viento</small>
        </div>
        <div className="detail-item">
          <WiSunrise size={28} />
          <span>{formatTime(sys.sunrise)}</span>
          <small>Amanecer</small>
        </div>
        <div className="detail-item">
          <WiSunset size={28} />
          <span>{formatTime(sys.sunset)}</span>
          <small>Atardecer</small>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;