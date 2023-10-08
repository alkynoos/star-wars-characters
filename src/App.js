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
  // const [count, setCount] = useState(0);

  const handleSearchResults = async (resultsPromise) => {
    const results = await resultsPromise;
    setSearchResults(results);
    setTotalPages(0);
    console.log("app.js", results, "app.js");
  };

  const resetState = () => {
    console.log("resetting state");
    setSearchResults([]);
    setCurrentPage(1);
    setMappedData([]);
    setIsLoading(false);
    setTotalPages(0);
  };

  const fetchCharacters = async (page = 1) => {
    setIsLoading(true);
    const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setIsLoading(false);
    // setCount(data.count);
    setTotalPages(Math.ceil(data.count / 10));
    return data.results;
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
      {isLoading ? (
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
