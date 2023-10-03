import React, { useState } from "react";
import "./CardDisplay.css";
import CharacterModal from "../character-modal/CharacterModal";
import {
  getBackgroundColorForSpecies,
  getTextColorForSpecies,
} from "../../helpers/speciesColors";

function CardDisplay({ characterData }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCharacter(null);
    setIsModalOpen(false);
  };

  return (
    <div className="row">
      {characterData.map((character) => (
        <div className="col-3 mb-2" key={character.name}>
          <div
            className="card"
            key={character.name}
            onClick={() => openModal(character)}
            style={{
              backgroundColor: getBackgroundColorForSpecies(character.species),
              color: getTextColorForSpecies(character.species),
            }}
          >
            <img
              src={`https://picsum.photos/200?random=${Math.floor(
                Math.random() * 100
              )}`}
              className="card-img-top img-fluid card-img"
              alt={character.name}
            />
            <div className="card-body">
              <h5 className="card-title">{character.name}</h5>
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && (
        <CharacterModal
          character={selectedCharacter}
          isOpen={openModal}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default CardDisplay;
