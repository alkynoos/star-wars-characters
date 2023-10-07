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
  selectedDDFilm,
  selectedDDPlanet,
  selectedDDSpecie,
  searchText,
  films,
  homeworlds,
  species
) {
  const filters = [];
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
  if (searchText !== "") {
    filters.push({ filter: "searchText", value: searchText });
  }
  console.log("filters", filters);

  return filters;
}

async function filterCharacters(characterSearchResults, setState, filters) {
  let filteredData = [];
  let singleFilter = filters.length === 1 ? true : false;

  for (let i = 0; i < filters.length; i++) {
    filteredData = await filterData(
      filters[i].filter,
      filters[i].value,
      filters[i].dropdownData,
      characterSearchResults.results,
      singleFilter
    );
    console.log("filteredData", filteredData);
  }

  setState(filteredData);
}
async function filterData(
  filter,
  filterValue,
  dropdownData,
  data,
  singleFilter = false
) {
  console.log("filterData", filter, filterValue, data, singleFilter);
  const propName = filter === "films" ? "title" : "name";
  if (!singleFilter) {
    console.log("multiple filters", filter);
    return data.filter(
      (character) =>
        character.filter === getSelectedUrl(filter, propName, filterValue)
    );
  } else {
    console.log("single filter", filter);
    let url = getSelectedUrl(dropdownData, propName, filterValue);
    const characterFromFilter = await fetchCharacterFromFilter(url, filter);
    console.log("characterFromFilter", characterFromFilter);
    return characterFromFilter;
  }
}
const fetchCharacterFromFilter = async (url, filter) => {
  const characters = [];
  const response = await axios.get(url);
  let fetchedCharacter = [];
  console.log("fileter", filter);
  console.log("response", response);

  if (response.data) {
    if (filter === "films") {
      for (let i = 0; i < response.data.characters.length; i++) {
        console.log("inside for loop" + i);
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
      selectedDDFilm,
      selectedDDPlanet,
      selectedDDSpecie,
      searchText,
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
        document.getElementById("films").value = "";
        break;
      case "loadMoreHomeworlds":
        fetchData(homeworldsNextLink, setHomeworlds, setHomeworldsNextLink);
        document.getElementById("homeworlds").value = "";
        break;
      case "loadMoreSpecies":
        fetchData(speciesNextLink, setSpecies, setSpeciesNextLink);
        document.getElementById("species").value = "";
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
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
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
