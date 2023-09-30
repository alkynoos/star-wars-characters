import React, { useState, useEffect } from "react";
import "./App.css";
import CardDisplay from "./components/card-display/CardDisplay";
import Loader from "./components/loader/Loader";
import Pagination from "./components/pagination/Pagination"; // Import the Pagination component

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://swapi.dev/api/people/?page=${currentPage}`
        );
        const data = await response.json();
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentPage]);

  const totalPages = Math.ceil(data.count / 10); // Calculate total pages based on the count

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="App">
      <header className="App-header header">Star Wars</header>
      {isLoading ? <Loader /> : <CardDisplay characterData={data.results} />}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default App;
