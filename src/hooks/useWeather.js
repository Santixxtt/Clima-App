import { useState } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; //Si la variable no viene con VITE, el código no expone la llave.
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchWeather(city) {
    setLoading(true);
    setError(null);

    try {
      const [weatherRes, forecastRes] = await Promise.all([ // Promise.all lanza dos peticiones al mismo tiempo, y espera a que ambas terminen, en vez de mandar una, esperar, y mandar la otra.
        fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`),
        fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`)
      ]);

      if (!weatherRes.ok) throw new Error("Ciudad no encontrada");

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setWeather(weatherData);

      // Filtramos solo 1 resultado por día (cada 24h)
      const daily = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);
      setForecast(daily);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { weather, forecast, loading, error, fetchWeather };
}