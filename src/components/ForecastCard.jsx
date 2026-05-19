function ForecastCard({ forecast }) {
  function formatDay(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString("es-CO", {
      weekday: "long",
    });
  }

  return (
    <div className="forecast">
      <h3>Pronóstico para la semana</h3>
      <div className="forecast__list">
        {forecast.map((day) => {
          const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
          return (
            <div key={day.dt} className="forecast__item">
              <p className="forecast__day">{formatDay(day.dt)}</p>
              <img src={icon} alt={day.weather[0].description} />
              <p className="forecast__temp">{Math.round(day.main.temp)}°C</p>
              <p className="forecast__desc">{day.weather[0].description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ForecastCard;