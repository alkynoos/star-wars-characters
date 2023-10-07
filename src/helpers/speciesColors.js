const speciesColorCache = {};

export async function mapSpeciesNames(characterData) {
  const mappedCharacterData = await Promise.all(
    characterData.map(async (character) => {
      if (character.species && character.species.length > 0) {
        let speciesName = "Unknown Species";
        if (speciesColorCache[character.species]) {
          speciesName = speciesColorCache[character.species].name;
        } else {
          const speciesResponse = await fetch(character.species[0]);
          const speciesData = await speciesResponse.json();
          speciesName = speciesData.name || "Unknown Species";
          speciesColorCache[character.species] = {
            name: speciesName,
            backgroundColor:
              speciesColors[speciesName]?.backgroundColor || "#9FA4C4",
            textColor: speciesColors[speciesName]?.textColor || "#000000",
          };
        }
        character.species = speciesName;
      } else {
        character.species = "Unknown Species";
      }
      return character;
    })
  );

  return mappedCharacterData;
}

// use the mapping of colors when u receice the data from the api

export function getBackgroundColorForSpecies(species) {
  return speciesColors[species]?.backgroundColor || "bg-secondary";
}

export function getTextColorForSpecies(species) {
  return speciesColors[species]?.textColor || "text-dark";
}

export const speciesColors = {
  "Unknown Species": {
    backgroundColor: "#9FA4C4",
    textColor: "#000000",
  },
  Human: {
    backgroundColor: "#175676",
    textColor: "text-white",
  },
  Droid: {
    backgroundColor: "#3A3A3A",
    textColor: "text-white",
  },
  Wookie: {
    backgroundColor: "#765432",
    textColor: "text-white",
  },
  Rodian: {
    backgroundColor: "#008000",
    textColor: "text-white",
  },
  Hutt: {
    backgroundColor: "#6B8E23",
    textColor: "text-white",
  },
  "Yoda's species": {
    backgroundColor: "#2E8B57",
    textColor: "text-white",
  },
  Trandoshan: {
    backgroundColor: "#228B22",
    textColor: "text-white",
  },
  "Mon Calamari": {
    backgroundColor: "#008080",
    textColor: "text-white",
  },
  Ewok: {
    backgroundColor: "#8B4513",
    textColor: "text-white",
  },
  Sullustan: {
    backgroundColor: "#FF4500",
    textColor: "#000000",
  },
  Neimodian: {
    backgroundColor: "#8B008B",
    textColor: "text-white",
  },
  Gungan: {
    backgroundColor: "#6495ED",
    textColor: "text-white",
  },
  Toydarian: {
    backgroundColor: "#BDB76B",
    textColor: "#000000",
  },
  Dug: {
    backgroundColor: "#D2691E",
    textColor: "text-white",
  },
  "Twi'lek": {
    backgroundColor: "#800080",
    textColor: "text-white",
  },
  Aleena: {
    backgroundColor: "#4169E1",
    textColor: "text-white",
  },
  Vulptereen: {
    backgroundColor: "#483D8B",
    textColor: "text-white",
  },
  Xexto: {
    backgroundColor: "#8A2BE2",
    textColor: "text-white",
  },
  Toong: {
    backgroundColor: "#DC143C",
    textColor: "text-white",
  },
  Cerean: {
    backgroundColor: "#5F9EA0",
    textColor: "text-white",
  },
  Nautolan: {
    backgroundColor: "#20B2AA",
    textColor: "text-white",
  },
  Zabrak: {
    backgroundColor: "#00CED1",
    textColor: "text-white",
  },
  Tholothian: {
    backgroundColor: "#00FF00",
    textColor: "#000000",
  },
  Iktotchi: {
    backgroundColor: "#0000FF",
    textColor: "text-white",
  },
  Quermian: {
    backgroundColor: "#8B008B",
    textColor: "text-white",
  },
  "Kel Dor": {
    backgroundColor: "#FF4500",
    textColor: "#000000",
  },
  Chagrian: {
    backgroundColor: "#800080",
    textColor: "text-white",
  },
  Geonosian: {
    backgroundColor: "#008000",
    textColor: "text-white",
  },
  Mirialan: {
    backgroundColor: "#BDB76B",
    textColor: "#000000",
  },
  Clawdite: {
    backgroundColor: "#D2691E",
    textColor: "text-white",
  },
  Besalisk: {
    backgroundColor: "#2E8B57",
    textColor: "text-white",
  },
  Kaminoan: {
    backgroundColor: "#228B22",
    textColor: "text-white",
  },
  Skakoan: {
    backgroundColor: "#6495ED",
    textColor: "text-white",
  },
  Muun: {
    backgroundColor: "#8B4513",
    textColor: "text-white",
  },
  Togruta: {
    backgroundColor: "#008080",
    textColor: "text-white",
  },
  Kaleesh: {
    backgroundColor: "#4169E1",
    textColor: "text-white",
  },
  "Pau'an": {
    backgroundColor: "#483D8B",
    textColor: "text-white",
  },
};

// export const speciesList = [
//   "Human",
//   "Droid",
//   "Wookie",
//   "Rodian",
//   "Hutt",
//   "Yoda's species",
//   "Trandoshan",
//   "Mon Calamari",
//   "Ewok",
//   "Sullustan",
//   "Neimodian",
//   "Gungan",
//   "Toydarian",
//   "Dug",
//   "Twi'lek",
//   "Aleena",
//   "Vulptereen",
//   "Xexto",
//   "Toong",
//   "Cerean",
//   "Nautolan",
//   "Zabrak",
//   "Tholothian",
//   "Iktotchi",
//   "Quermian",
//   "Kel Dor",
//   "Chagrian",
//   "Geonosian",
//   "Mirialan",
//   "Clawdite",
//   "Besalisk",
//   "Kaminoan",
//   "Skakoan",
//   "Muun",
//   "Togruta",
//   "Kaleesh",
//   "Pau'an",
// ];
