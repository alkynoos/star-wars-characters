import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBar.css";

async function fetchData(url, setState, setNextLink) {
  try {
    const response = await axios.get(url);
    setState((prevState) => [...prevState, ...response.data.results]);
    setNextLink(response.data.next);
  } catch (error) {
    console.error(error);
  }
}

function getSelectedUrl(items, propName, selectedValue) {
  const selectedItem = items.find((item) => item[propName] === selectedValue);

  return selectedItem ? selectedItem.url : null;
}

function selectedFilters(
  searchText,
  selectedDDFilm,
  selectedDDPlanet,
  selectedDDSpecie,
  films,
  homeworlds,
  species
) {
  const filters = [];
  if (searchText !== "") {
    filters.push({ filter: "searchText", value: searchText });
  }
  if (selectedDDFilm !== "Select a Film") {
    filters.push({
      filter: "films",
      value: selectedDDFilm,
      dropdownData: films,
    });
  }
  if (selectedDDPlanet !== "Select a Homeworld") {
    filters.push({
      filter: "planets",
      value: selectedDDPlanet,
      dropdownData: homeworlds,
    });
  }
  if (selectedDDSpecie !== "Select a Species") {
    filters.push({
      filter: "species",
      value: selectedDDSpecie,
      dropdownData: species,
    });
  }
  return filters;
}

async function filterCharacters(characterSearchResults, setState, filters) {
  let filteredData = characterSearchResults.results;
  let singleFilter = filters.length === 1 ? true : false;
  console.log("characterSearchResults.results", characterSearchResults);

  for (let i = 0; i < filters.length; i++) {
    filteredData = await filterData(
      filters[i].filter,
      filters[i].value,
      filters[i].dropdownData,
      filteredData,
      singleFilter
    );
  }
  console.log("filteredData", filteredData);
  setState(filteredData);
}
async function filterData(
  filter,
  filterValue,
  dropdownData,
  data,
  singleFilter = false
) {
  console.log("filterData", filter, filterValue, dropdownData, data);
  const propName = filter === "films" ? "title" : "name";

  if (!singleFilter) {
    if (filter === "searchText") return data;
    let url = getSelectedUrl(dropdownData, propName, filterValue);
    console.log("url", url);
    if (filter === "films")
      return data.filter((character) => character.films.includes(url));
    if (filter === "planets")
      return data.filter((character) => character.homeworld === url);
    if (filter === "species")
      return data.filter((character) => character.species.includes(url));
  } else {
    console.log("singleFilter", singleFilter);
    if (filter === "searchText") return data;
    let url = getSelectedUrl(dropdownData, propName, filterValue);
    const characterFromFilter = await fetchCharacterFromFilter(url, filter);
    return characterFromFilter;
  }
}
const fetchCharacterFromFilter = async (url, filter) => {
  const characters = [];
  const response = await axios.get(url);
  let fetchedCharacter = [];

  if (response.data) {
    if (filter === "films") {
      for (let i = 0; i < response.data.characters.length; i++) {
        fetchedCharacter = await fetchCharacter(response.data.characters[i]);
        characters.push(fetchedCharacter);
      }
    }
    if (filter === "planets") {
      for (let i = 0; i < response.data.residents.length; i++) {
        fetchedCharacter = await fetchCharacter(response.data.residents[i]);
        characters.push(fetchedCharacter);
      }
    }
    if (filter === "species") {
      for (let i = 0; i < response.data.people.length; i++) {
        fetchedCharacter = await fetchCharacter(response.data.people[i]);
        characters.push(fetchedCharacter);
      }
    }
  }

  return characters;
};

const fetchCharacter = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

function SearchBar(props) {
  const [searchText, setSearchText] = useState("");
  const [films, setFilms] = useState([]);
  const [homeworlds, setHomeworlds] = useState([]);
  const [species, setSpecies] = useState([]);
  const [filmsNextLink, setFilmsNextLink] = useState(null);
  const [homeworldsNextLink, setHomeworldsNextLink] = useState(null);
  const [speciesNextLink, setSpeciesNextLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedDDFilm = document.getElementById("films").value;
    const selectedDDPlanet = document.getElementById("homeworlds").value;
    const selectedDDSpecie = document.getElementById("species").value;
    const filters = selectedFilters(
      searchText,
      selectedDDFilm,
      selectedDDPlanet,
      selectedDDSpecie,
      films,
      homeworlds,
      species
    );

    const response = await axios.get(
      `https://swapi.dev/api/people/?search=${encodeURIComponent(searchText)}`
    );
    const characterSearchResults = response.data;
    filterCharacters(characterSearchResults, props.onSearchResults, filters);
    setIsLoading(false);
  };

  const handleReset = () => {
    setSearchText("");
    document.getElementById("films").selectedIndex = 0;
    document.getElementById("homeworlds").selectedIndex = 0;
    document.getElementById("species").selectedIndex = 0;
  };

  useEffect(() => {
    fetchData("https://swapi.dev/api/films/", setFilms, setFilmsNextLink);
    fetchData(
      "https://swapi.dev/api/planets/",
      setHomeworlds,
      setHomeworldsNextLink
    );
    fetchData("https://swapi.dev/api/species/", setSpecies, setSpeciesNextLink);
  }, []);

  const handleDropdownChange = (selectedOption) => {
    switch (selectedOption) {
      case "loadMoreFilms":
        fetchData(filmsNextLink, setFilms, setFilmsNextLink);
        document.getElementById("films").selectedIndex = 0;
        break;
      case "loadMoreHomeworlds":
        fetchData(homeworldsNextLink, setHomeworlds, setHomeworldsNextLink);
        document.getElementById("homeworlds").selectedIndex = 0;
        break;
      case "loadMoreSpecies":
        fetchData(speciesNextLink, setSpecies, setSpeciesNextLink);
        document.getElementById("species").selectedIndex = 0;
        break;
      default:
      // Handle other dropdown selections
    }

    setIsLoading(false);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <div className="row d-flex">
            <input
              type="text"
              id="people"
              placeholder="Search for a character..."
              className="form-control"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="dropdowns mt-2 d-flex">
            <select
              id="films"
              placeholder="Select a Film"
              className="form-select me-2"
              onChange={(e) => handleDropdownChange(e.target.value)}
            >
              <option>Select a Film</option>
              {films.map((film, index) => (
                <option key={`film-${film.url}-${index}`}>{film.title}</option>
              ))}
              {filmsNextLink && (
                <option value="loadMoreFilms">Load More Films</option>
              )}
            </select>
            <select
              id="homeworlds"
              placeholder="Select a Homeworld"
              className="form-select me-2"
              onChange={(e) => handleDropdownChange(e.target.value)}
            >
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
            <select
              id="species"
              placeholder="Select a Species"
              className="form-select me-2"
              onChange={(e) => handleDropdownChange(e.target.value)}
            >
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
            <button type="submit" className="btn btn-primary me-2">
              Search
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
      {isLoading && (
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
