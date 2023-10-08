//TODO:
// Refactor this component to use react-query if you have time - remove it from the project with the commands
// Remove the pagination when showing resualts from the search bar - fetch data complet think if posible to optimize it (maybe i should check the code and choose the lowest code)
// Check the weard behavior of the rendering in general - search dropdowns DONE
// Give to the data url for photos so they are consistant
// Fix the loading in general
// Error handling
// Refactor the code to be more readable
// find the unknown species if does not exist add it

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBar.css";

async function fetchDropdownData(url, setState, setNextLink) {
  try {
    const response = await axios.get(url);
    setState((prevState) => [...prevState, ...response.data.results]);
    setNextLink(response.data.next);
  } catch (error) {
    console.error(error);
  }
}
async function fetchDataForSearch(url) {
  const response = await axios.get(url);
  while (response.data.next) {
    const response2 = await axios.get(response.data.next);
    response.data.results = [
      ...response.data.results,
      ...response2.data.results,
    ];
    response.data.next = response2.data.next;
  }
  return response;
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
  if (searchText.trim() !== "") {
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

  for (let i = 0; i < filters.length; i++) {
    filteredData = await filterData(
      filters[i].filter,
      filters[i].value,
      filters[i].dropdownData,
      filteredData,
      singleFilter
    );
  }

  if (filteredData.length === 0) {
    alert("We couldn't find anyone with those parameters.");
  }
  console.log(filteredData);
  setState(filteredData);
}
async function filterData(
  filter,
  filterValue,
  dropdownData,
  data,
  singleFilter = false
) {
  const propName = filter === "films" ? "title" : "name";

  if (!singleFilter) {
    if (filter === "searchText") return data;
    let url = getSelectedUrl(dropdownData, propName, filterValue);
    if (filter === "films")
      return data.filter((character) => character.films.includes(url));
    if (filter === "planets")
      return data.filter((character) => character.homeworld === url);
    if (filter === "species")
      return data.filter((character) => character.species.includes(url));
  } else {
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

    if (filters.length === 0) {
      alert("Please select at least one filter to search.");
      setIsLoading(false);
      return;
    }

    const searchUrl = `https://swapi.dev/api/people/?search=${encodeURIComponent(
      searchText
    )}`;
    const response = await fetchDataForSearch(searchUrl);

    const characterSearchResults = response.data;
    filterCharacters(characterSearchResults, props.onSearchResults, filters);
    setIsLoading(false);
  };

  const handleReset = () => {
    setSearchText("");
    document.getElementById("films").selectedIndex = 0;
    document.getElementById("homeworlds").selectedIndex = 0;
    document.getElementById("species").selectedIndex = 0;
    props.onReset();
  };

  useEffect(() => {
    initializeDropdowns();
  }, []);

  const initializeDropdowns = async () => {
    console.log("dropdowns", films, homeworlds, species);
    if (films.length > 0 || homeworlds.length > 0 || species.length > 0) return;
    console.log("initializeDropdowns");
    setIsLoading(true);
    await fetchDropdownData(
      "https://swapi.dev/api/films/",
      setFilms,
      setFilmsNextLink
    );
    await fetchDropdownData(
      "https://swapi.dev/api/planets/",
      setHomeworlds,
      setHomeworldsNextLink
    );
    await fetchDropdownData(
      "https://swapi.dev/api/species/",
      setSpecies,
      setSpeciesNextLink
    );
    setIsLoading(false);
  };

  const handleDropdownChange = (selectedOption) => {
    switch (selectedOption) {
      case "loadMoreFilms":
        fetchDropdownData(filmsNextLink, setFilms, setFilmsNextLink);
        document.getElementById("films").selectedIndex = 0;
        break;
      case "loadMoreHomeworlds":
        fetchDropdownData(
          homeworldsNextLink,
          setHomeworlds,
          setHomeworldsNextLink
        );
        document.getElementById("homeworlds").selectedIndex = 0;
        break;
      case "loadMoreSpecies":
        fetchDropdownData(speciesNextLink, setSpecies, setSpeciesNextLink);
        document.getElementById("species").selectedIndex = 0;
        break;
      default:
        break;
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
