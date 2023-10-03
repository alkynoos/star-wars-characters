// import SearchBar from "./components/search-bar/SearchBar";
import React, { useState, useEffect } from "react";
import "./App.css";
import CardDisplay from "./components/card-display/CardDisplay";
import Loader from "./components/loader/Loader";
import Pagination from "./components/pagination/Pagination";
import { mapSpeciesNames } from "./helpers/speciesColors";

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mappedData, setMappedData] = useState([]);

  const fetchData = async (page) => {
    try {
      const response = await fetch(
        `https://swapi.dev/api/people/?page=${page}`
      );
      if (!response.ok) {
        // Check the response status code
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMappedData = async (results) => {
    const mappedData = await mapSpeciesNames(results);
    setMappedData(mappedData);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (data.results) {
      // Add a check to ensure that data.results is not undefined
      fetchMappedData(data.results);
    }
  }, [data.results]);

  const totalPages = Math.ceil(data.count / 10);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="App">
      <header className="App-header header">Star Wars</header>
      {/* <SearchBar /> */}
      {isLoading ? <Loader /> : <CardDisplay characterData={mappedData} />}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default App;
