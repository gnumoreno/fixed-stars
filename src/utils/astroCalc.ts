import { type house } from "~/server/api/routers/houses";
import { type planet } from "~/server/api/routers/planets";

export const Signs = [
  { sign: "Aries", unicode: '\u2648', angle: 0, domicile: "Mars", exaltation: "Sun", triplicity_day: "Sun", triplicity_night: "Jupiter", detriment: "Venus", fall: "Saturn", terms: [], faces: ["Mars", "Sun", "Venus"] },
  { sign: "Taurus", unicode: '\u2649', angle: 30, domicile: "Venus", exaltation: "Moon", triplicity_day: "Venus", triplicity_night: "Moon", detriment: "Mars", fall: "none", terms: [], faces: ["Mercury", "Moon", "Saturn"] },
  { sign: "Gemini", unicode: '\u264A', angle: 60, domicile: "Mercury", exaltation: "none", triplicity_day: "Saturn", triplicity_night: "Mercury", detriment: "Jupiter", fall: "none", terms: [], faces: ["Jupiter", "Mars", "Sun"] },
  { sign: "Cancer", unicode: '\u264B', angle: 90, domicile: "Moon", exaltation: "Jupiter", triplicity_day: "Mars", triplicity_night: "Mars", detriment: "Saturn", fall: "Mars", terms: [], faces: ["Venus", "Mercury", "Moon"] },
  { sign: "Leo", unicode: '\u264C', angle: 120, domicile: "Sun", exaltation: "none", triplicity_day: "Sun", triplicity_night: "Jupiter", detriment: "Saturn", fall: "none", terms: [], faces: ["Sun", "Venus", "Mercury"] },
  { sign: "Virgo", unicode: '\u264D', angle: 150, domicile: "Mercury", exaltation: "Mercury", triplicity_day: "Venus", triplicity_night: "Moon", detriment: "Jupiter", fall: "Venus", terms: [], faces: ["Sun", "Venus", "Mercury"] },
  { sign: "Libra", unicode: '\u264E', angle: 180, domicile: "Venus", exaltation: "Saturn", triplicity_day: "Saturn", triplicity_night: "Mercury", detriment: "Mars", fall: "Sun", terms: [], faces: ["Moon", "Saturn", "Jupiter"] },
  { sign: "Scorpio", unicode: '\u264F', angle: 210, domicile: "Mars", exaltation: "none", triplicity_day: "Mars", triplicity_night: "Mars", detriment: "Venus", fall: "Moon", terms: [], faces: ["Mars", "Sun", "Venus"] },
  { sign: "Sagittarius", unicode: '\u2650', angle: 240, domicile: "Jupiter", exaltation: "none", triplicity_day: "Sun", triplicity_night: "Jupiter", detriment: "Mercury", fall: "none", terms: [], faces: ["Mercury", "Moon", "Saturn"] },
  { sign: "Capricorn", unicode: '\u2651', angle: 270, domicile: "Saturn", exaltation: "Mars", triplicity_day: "Venus", triplicity_night: "Moon", detriment: "Moon", fall: "Jupiter", terms: [], faces: ["Jupiter", "Mars", "Sun"] },
  { sign: "Aquarius", unicode: '\u2652', angle: 300, domicile: "Saturn", exaltation: "none", triplicity_day: "Saturn", triplicity_night: "Mercury", detriment: "Sun", fall: "none", terms: [], faces: ["Venus", "Mercury", "Moon"] },
  { sign: "Pisces", unicode: '\u2653', angle: 330, domicile: "Jupiter", exaltation: "Venus", triplicity_day: "Mars", triplicity_night: "Mars", detriment: "Mercury", fall: "Mercury", terms: [], faces: ["Saturn", "Jupiter", "Mars"] },
];

// const aspectType = [
//   { name: "conjunction", angle: 0, unicode: "u260C" },
//   { name: "sextile", angle: 60, unicode: "u26B9" },
//   { name: "square", angle: 90, unicode: "u25A1" },
//   { name: "trine", angle: 120, unicode: "u25B3" },
//   { name: "oposition", angle: 180, unicode: "u260D" },
// ];

const calculateModulo360becauseJSisStupid = (value: number) => {
  const result = value % 360;
  return result >= 0 ? result : result + 360;
};


export const signFromDec = (long: number) => {
  let mySign = { sign: "Pisces", angle: 330 };
  let stop = false;
  Signs.forEach((sign, idx) => {
    if (calculateModulo360becauseJSisStupid(long) < sign.angle && stop === false) {
      mySign = Signs[idx - 1]!;
      stop = true;
    }
  });
  return mySign;
};

export const houseFromDec = (houses: house[], element: number) => {
  const onlyHouses = houses.filter(house => house.name.includes("house")).sort((a, b) => a.position - b.position);
  let stop = false;
  let myHouse = onlyHouses[onlyHouses.length - 1];
  onlyHouses.forEach((house, idx) => {
    if (element < house.position && stop === false) {
      if(idx === 0) {
        return;
      }
      myHouse = onlyHouses[idx - 1]!;
      stop = true;
    }
  })
  return myHouse.name.split(" ").pop();

};

export const ascPos = (houses: house[]) => {
  const ascendant = houses.find((house) => house.name === "house  1");
  const ascendantPos = ascendant ? ascendant.position : null;
  return ascendantPos;
};

export const housePositions = (houses: house[]) => {  
  const onlyHouses = houses.filter(house => house.name.includes("house"));
  const drawHousePositions = onlyHouses.map((house) => calculateModulo360becauseJSisStupid(house.position - ascPos(houses))).sort((a, b) => a - b);
  return drawHousePositions;
};

export const findHorizon = (houses: house[]) => {
  const ascendant = houses.find((house) => house.name === "house  1");
  const descendant = houses.find((house) => house.name === "house  7");
  const ascendantPos = (calculateModulo360becauseJSisStupid(ascendant ? ascendant.position : null) + 3);
  const descendantPos = (calculateModulo360becauseJSisStupid(descendant ? descendant.position : null) - 3);
  const horizon = [ascendantPos, descendantPos];
  return horizon;
};

export const dayOrNight = (planets: planet[], houses: house[]) => {
  const sun = planets.find((planet) => planet.name === "Sun");
  const sunPos = sun ? sun.position : null;
  const horizon = findHorizon(houses);
  let dayOrNight: string;
  if (calculateModulo360becauseJSisStupid(sunPos) >= horizon[1] || calculateModulo360becauseJSisStupid(sunPos) <= horizon[0]) {
    dayOrNight = "day";
  } else {
    dayOrNight = "night";
  }
  return dayOrNight;
};

export const getTriplicityArray = (planets: planet[] | null, houses: house[] | null) => {
  if (!planets || !houses) {
    // Return an empty array or handle the case where data is not available
    return [];
  }

  const dayOrNightValue = dayOrNight(planets, houses);
  const triplicityArray: string[] = []; // Create an empty array to hold unicode symbols

  // Loop through the Signs array and find the corresponding triplicity planet for each sign
  Signs.forEach((sign) => {
    const planetName = dayOrNightValue === "day" ? sign.triplicity_day : sign.triplicity_night;
    const planet = planets.find((p) => p.name === planetName);
    triplicityArray.push(planet ? planet.unicode : "");
  });

  return triplicityArray; // Return the array of unicode symbols
};

export const getAllFaces = (planets: planet[]) => {
  const allFaces: string[] = [];

  // Loop through each sign in the Signs array
  Signs.forEach((sign) => {
    // Loop through each face name in the sign's faces array
    sign.faces.forEach((faceName) => {
      // Find the corresponding PlanetProperties object based on the face name
      const planet = planets.find((planet) => planet.name === faceName);
      // If a matching planet is found, add its unicode to the allFaces array
      if (planet) {
        allFaces.push(planet.unicode);
      }
    });
  });

  return allFaces; // Return the array of unicode symbols
};

export const antisciaPosition = (long: number) => {
  return calculateModulo360becauseJSisStupid(90 - (long - 90));
};

export const contraAntisciaPosition = (antiscia: number) => {
  return calculateModulo360becauseJSisStupid(antiscia + 180);
};
export const signPositions = (houses: house[]) => {  
  const drawSignPositions = Signs.map((sign) => calculateModulo360becauseJSisStupid(sign.angle - ascPos(houses)));
  return drawSignPositions;
};

export const planetPositions = (planets: planet[], houses: house[]) => {  
  const drawSignPositions = planets.map((planet) => calculateModulo360becauseJSisStupid(planet.position - ascPos(houses)));
  return drawSignPositions;
};

export const planetAntiscia = (planets: planet[], houses: house[]) => {
  const drawAntisciaPositions = planets.map((planet) => calculateModulo360becauseJSisStupid(antisciaPosition(planet.position) - ascPos(houses)));
  return drawAntisciaPositions;
};

export const planetContraAntiscia = (planets: planet[], houses: house[]) => {
  const drawContraAntisciaPositions = planets.map((planet) => calculateModulo360becauseJSisStupid(contraAntisciaPosition(planet.position) - ascPos(houses)));
  return drawContraAntisciaPositions;
};

export const decToDMS = (long: number) => {
  const mySign = signFromDec(long);
  const signDegree = long - mySign.angle;
  const signMinute = (signDegree - Math.floor(signDegree)) * 60;
  const signSecond = (signMinute - Math.floor(signMinute)) * 60;
  return {
    ...mySign,
    signDegree: Math.floor(signDegree),
    signMinute: Math.floor(signMinute),
    signSecond: parseFloat(signSecond.toFixed(2)),
  };
};

export type DMSObj = {
  sign: string;
  signDegree: number;
  signMinute: number;
  signSecond: number;
  angle: number;
};

export const dmsToDec = (degrees: number, minutes: number, seconds: number): number => {
  const sign = degrees < 0 ? -1 : 1; // Determine the sign of the degrees
  const positiveDegrees = Math.abs(degrees); // Convert degrees to positive value for calculation
  const decimal = positiveDegrees + (minutes / 60) + (seconds / 3600);
  return decimal * sign; // Apply the sign to the calculated decimal value
};