import { HiSearch } from "react-icons/hi";
import { useState } from "react";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim() === "") return;
    onSearch(city.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Busca tu ciudad..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" aria-label="Buscar">
          <HiSearch size={24} />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;