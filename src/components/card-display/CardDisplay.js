import React from "react";
import "./CardDisplay.css";

function CardDisplay({ characterData }) {
  const backgroundColors = [
    "bg-primary",
    "bg-secondary",
    "bg-success",
    "bg-danger",
    "bg-warning",
  ];
  return (
    <div className="row">
      {characterData.map((character) => (
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
  );
}

export default CardDisplay;
