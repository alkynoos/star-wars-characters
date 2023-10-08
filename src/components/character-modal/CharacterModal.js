import React from "react";
import ReactDOM from "react-dom";
import "./CharacterModal.css";
import {
  getBackgroundColorForSpecies,
  getTextColorForSpecies,
} from "../../helpers/speciesColors";

function CharacterModal({ isOpen, onClose, character }) {
  if (!isOpen) return null;

  function formatDateString(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  if (!character) {
    return ReactDOM.createPortal(
      <div className="overlay-style">
        <div className="modal-style">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn-close btn-danger"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="card-modal">
            <div className="card-body">
              <h5 className="card-title">Error</h5>
              <p className="card-text">Failed to load character data.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return ReactDOM.createPortal(
    <>
      <div className="overlay-style" />
      <div className="modal-style">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn-close btn-danger"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        <div
          className="card-modal"
          key={character.name}
          style={{
            backgroundColor: getBackgroundColorForSpecies(character.species),
            color: getTextColorForSpecies(character.species),
          }}
        >
          <h4 className="card-title text-center">{character.name}</h4>
          <img
            src={character.image}
            className="card-img-top img-fluid card-img"
            alt={character.name}
          />
          <div className="card-body">
            <div className="card-info">
              Height: <span>{character.height / 100} m</span>
            </div>
            <div className="card-info">
              Mass:
              <span> {character.mass} kg</span>
            </div>
            <div className="card-info">
              Date added to API:
              <span>{formatDateString(character.created)}</span>
            </div>
            <div className="card-info">
              Number of films: <span>{character.films.length}</span>
            </div>
            <div className="card-info">
              Birth year: <span>{character.birth_year}</span>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root")
  );
}

export default CharacterModal;
