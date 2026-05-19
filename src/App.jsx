import { useState, useEffect } from "react";
import { useWeather } from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import { MdHistory } from "react-icons/md";

const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY;
const HISTORY_KEY = "weather_history";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function getHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  const now = Date.now();
  return parsed.filter((item) => now - item.timestamp < SEVEN_DAYS);
}

function saveHistory(city) {
  const history = getHistory().filter(
    (item) => item.city.toLowerCase() !== city.toLowerCase()
  );
  const updated = [{ city, timestamp: Date.now() }, ...history].slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

function App() {
  const { weather, forecast, loading, error, fetchWeather } = useWeather();
  const [history, setHistory] = useState(getHistory());
  const [showHistory, setShowHistory] = useState(false);
  const [bgPhoto, setBgPhoto] = useState(true);
  const [bgUrl, setBgUrl] = useState(null);

  function handleSearch(city) {
    fetchWeather(city);
    saveHistory(city);
    setHistory(getHistory());
    setShowHistory(false);
    fetchCityImage(city);
  }

  function handleHistoryClick(city) {
    handleSearch(city);
  }

  async function fetchCityImage(city) {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${city}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_KEY,
        },
      }
    );

    const data = await res.json();

    if (data.photos?.length > 0) {
      setBgUrl(data.photos[0].src.landscape);
    }
  } catch (err) {
    console.error("Error cargando imagen:", err);
  }
}

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".history-wrapper")) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (bgPhoto && bgUrl) {
      document.body.style.backgroundImage = `
        linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
        url(${bgUrl})
      `;

      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage =
        "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)";
    }
  }, [bgPhoto, bgUrl]);

  return (
    <div className={`app ${bgPhoto && bgUrl ? "app--photo" : ""}`}>
      {bgUrl && (
        <button
          className="bg-toggle"
          onClick={() => setBgPhoto((prev) => !prev)}
        >
          {bgPhoto ? "Color sólido" : "Ciudad"}
        </button>
      )}

      <div className="history-wrapper">
        <button
          className="history-btn"
          onClick={() => setShowHistory((prev) => !prev)}
          aria-label="Historial"
        >
          <MdHistory size={22} />
        </button>

        {showHistory && (
          <div className="history-dropdown">
            <p className="history-title">Búsquedas recientes</p>
            {history.length === 0 ? (
              <p className="history-empty">Sin búsquedas aún</p>
            ) : (
              history.map((item) => (
                <button
                  key={item.timestamp}
                  className="history-item"
                  onClick={() => handleHistoryClick(item.city)}
                >
                  {item.city}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <h1>¿Qué clima hace?</h1>
      <SearchBar onSearch={handleSearch} />

      {loading && <p className="status">Buscando...</p>}
      {error && <p className="status status--error">{error}</p>}

      {weather && (
        <>
          <WeatherCard weather={weather} />
          <ForecastCard forecast={forecast} />
        </>
      )}
    </div>
  );
}

export default App;