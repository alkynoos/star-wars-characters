import React from "react";

function CharacterModal({ character, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        <h2>{character.name}</h2>
        {/* Display additional character information here */}
      </div>
    </div>
  );
}

export default CharacterModal;
