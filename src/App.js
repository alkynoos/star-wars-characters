import React, { useState, useEffect } from "react";
import "./App.css";
import CardDisplay from "./components/card-display/CardDisplay";
import Loader from "./components/loader/Loader";
import Pagination from "./components/pagination/Pagination";
import { mapSpeciesNames } from "./helpers/speciesColors";
import SearchBar from "./components/search-bar/SearchBar";
import { useQuery } from "@tanstack/react-query";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mappedData, setMappedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchResults = async (resultsPromise) => {
    const results = await resultsPromise;
    setSearchResults(results);
    // console.log("app.js", results, "app.js");
  };

  const fetchCharacters = async (page = 1) => {
    setIsLoading(true);
    const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setIsLoading(false);
    return data;
  };

  const { data, isFetching } = useQuery(
    ["characters", currentPage],
    () => fetchCharacters(currentPage),
    { keepPreviousData: true }
  );

  const handleMapSpeciesNames = async (results) => {
    const mappedData = await mapSpeciesNames(results);
    setMappedData(mappedData);
  };

  useEffect(() => {
    if (data?.results) {
      handleMapSpeciesNames(data.results);
    }
  }, [data]);

  useEffect(() => {
    // console.log("search useEffect", searchResults);
    if (searchResults.length > 0) {
      handleMapSpeciesNames(searchResults);
    }
  }, [searchResults]);

  const totalPages = Math.ceil(data?.count / 10);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    fetchCharacters(currentPage);
  }, [currentPage]);

  return (
    <div className="App">
      <header className="App-header header">Star Wars</header>
      <SearchBar onSearchResults={handleSearchResults} />
      {isLoading || isFetching ? (
        <Loader key={`${isLoading}-${isFetching}`} />
      ) : (
        <CardDisplay
          key={JSON.stringify(mappedData)}
          characterData={mappedData}
        />
      )}
      <Pagination
        key={currentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
export default App;
