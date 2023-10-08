import React, { useState, useEffect } from "react";
import "./App.css";
import CardDisplay from "./components/card-display/CardDisplay";
import Loader from "./components/loader/Loader";
import Pagination from "./components/pagination/Pagination";
import { mapSpeciesNames } from "./helpers/speciesColors";
import SearchBar from "./components/search-bar/SearchBar";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mappedData, setMappedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  const handleSearchResults = async (resultsPromise) => {
    const results = await resultsPromise;
    setSearchResults(results);
    setTotalPages(0);
  };

  const resetState = () => {
    setSearchResults([]);
    setCurrentPage(1);
    setMappedData([]);
    setIsLoading(false);
    setTotalPages(0);
    setError(null);
  };

  const fetchCharacters = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://swapi.dev/api/people/?page=${page}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setIsLoading(false);
      setTotalPages(Math.ceil(data.count / 10));
      return data.results;
    } catch (error) {
      setIsLoading(false);
      setError("Error fetching data. Please try again later.");
      return [];
    }
  };

  const handleMapSpeciesNames = async (results) => {
    const mappedData = await mapSpeciesNames(results);
    setMappedData(mappedData);
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      handleMapSpeciesNames(searchResults);
    } else {
      fetchCharacters(currentPage).then(handleMapSpeciesNames);
    }
  }, [searchResults, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="App">
      <header className="App-header header">Star Wars</header>
      <SearchBar onSearchResults={handleSearchResults} onReset={resetState} />
      {error ? (
        <div className="error">{error}</div>
      ) : isLoading ? (
        <Loader />
      ) : (
        <CardDisplay
          key={JSON.stringify(mappedData)}
          characterData={mappedData}
        />
      )}
      {totalPages > 0 && (
        <Pagination
          key={currentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default App;
