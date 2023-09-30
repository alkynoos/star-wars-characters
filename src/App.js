import React, { useState, useEffect } from "react";
import "./App.css";
function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://swapi.dev/api/people/");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Define an array of background colors based on species length
  const backgroundColors = [
    "bg-primary",
    "bg-secondary",
    "bg-success",
    "bg-danger",
    "bg-warning",
  ];

  return (
    <div className="App">
      <header className="App-header header">Star Wars</header>
      <div className="row">
        {data.results &&
          data.results.map((character) => (
            <div className="col-3 mb-2" key={character.name}>
              <div
                className={`card ${
                  backgroundColors[
                    character.species.length % backgroundColors.length
                  ]
                }`}
              >
                <img
                  src={`https://picsum.photos/200?random=${Math.floor(
                    Math.random() * 100
                  )}`}
                  className="card-img-top img-fluid card-img"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">{character.name}</h5>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
