import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBar.css";

// const baseURL = "https://swapi.dev/api/";

function SearchBar() {
  const [films, setFilms] = useState([]);
  const [filmsNextLink, setFilmsNextLink] = useState(null);
  const [homeworlds, setHomeworlds] = useState([]);
  const [homeworldsNextLink, setHomeworldsNextLink] = useState(null);
  const [species, setSpecies] = useState([]);
  const [speciesNextLink, setSpeciesNextLink] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchFilms = async (url) => {
    try {
      const response = await axios.get(url || "https://swapi.dev/api/films/");
      setFilms((prevFilms) => [...prevFilms, ...response.data.results]);
      setFilmsNextLink(response.data.next);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const fetchHomeworlds = async (url) => {
    try {
      const response = await axios.get(url || "https://swapi.dev/api/planets/");
      setHomeworlds((prevHomeworlds) => [
        ...prevHomeworlds,
        ...response.data.results,
      ]);
      setHomeworldsNextLink(response.data.next);
    } catch (error) {
      console.error("Error fetching homeworlds:", error);
    }
  };

  const fetchSpecies = async (url) => {
    try {
      const response = await axios.get(url || "https://swapi.dev/api/species/");
      setSpecies((prevSpecies) => [...prevSpecies, ...response.data.results]);
      setSpeciesNextLink(response.data.next);
    } catch (error) {
      console.error("Error fetching species:", error);
    }
  };

  // const fetchSearchData = async (url, filter) => {
  //   try {
  //     const response = await axios.get(url || `${baseURL}${filter}/`);
  //     switch (filter) {
  //       case "films":
  //         setFilms((prevFilms) => [...prevFilms, ...response.data.results]);
  //         setFilmsNextLink(response.data.next);
  //         break;
  //       case "planets":
  //         setHomeworlds((prevHomeworlds) => [
  //           ...prevHomeworlds,
  //           ...response.data.results,
  //         ]);
  //         setHomeworldsNextLink(response.data.next);
  //         break;
  //       case "species":
  //         setSpecies((prevSpecies) => [
  //           ...prevSpecies,
  //           ...response.data.results,
  //         ]);
  //         setSpeciesNextLink(response.data.next);
  //         break;
  //       default:
  //       // Handle other dropdown selections
  //     }
  //   } catch (error) {
  //     console.error("Error fetching" + { filter } + ":", error);
  //   }
  // };

  useEffect(() => {
    fetchFilms();
    fetchHomeworlds();
    fetchSpecies();
    // fetchSearchData();
  }, []);

  const handleDropdownChange = (selectedOption) => {
    switch (selectedOption) {
      case "loadMoreFilms":
        fetchFilms(filmsNextLink);
        break;
      case "loadMoreHomeworlds":
        fetchHomeworlds(homeworldsNextLink);
        break;
      case "loadMoreSpecies":
        fetchSpecies(speciesNextLink);
        break;
      default:
      // Handle other dropdown selections
    }
  };

  const handleSearchClick = () => {
    // Access the user's input from the 'searchText' state variable
    const userInput = searchText;

    // Access the selected values from the dropdowns
    const selectedFilm = document.querySelector("#filmDropdown").value;
    const selectedHomeworld =
      document.querySelector("#homeworldDropdown").value;
    const selectedSpecies = document.querySelector("#speciesDropdown").value;

    // Now you can use 'userInput', 'selectedFilm', 'selectedHomeworld', and 'selectedSpecies'
    // in your search logic or send them to an API, etc.

    console.log("User's input:", userInput);
    console.log("Selected Film:", selectedFilm);
    console.log("Selected Homeworld:", selectedHomeworld);
    console.log("Selected Species:", selectedSpecies);
  };

  return (
    <div className="search-bar-container">
      <form>
        <input
          type="text"
          placeholder="Search for a character..."
          className="search-bar"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="dropdowns">
          <select onChange={(e) => handleDropdownChange(e.target.value)}>
            <option>Select a Film</option>
            {films.map((film, index) => (
              <option key={`film-${film.url}-${index}`}>{film.title}</option>
            ))}
            {filmsNextLink && (
              <option value="loadMoreFilms">Load More Films</option>
            )}
          </select>
          <select onChange={(e) => handleDropdownChange(e.target.value)}>
            <option>Select a Homeworld</option>
            {homeworlds.map((homeworld, index) => (
              <option key={`homeworld-${homeworld.url}-${index}`}>
                {homeworld.name}
              </option>
            ))}
            {homeworldsNextLink && (
              <option value="loadMoreHomeworlds">Load More Homeworlds</option>
            )}
          </select>
          <select onChange={(e) => handleDropdownChange(e.target.value)}>
            <option>Select a Species</option>
            {species.map((specie, index) => (
              <option key={`species-${specie.url}-${index}`}>
                {specie.name}
              </option>
            ))}
            {speciesNextLink && (
              <option value="loadMoreSpecies">Load More Species</option>
            )}
          </select>
        </div>
        <button className="search-button" onClick={handleSearchClick}>
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
