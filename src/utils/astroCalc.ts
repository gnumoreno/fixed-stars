import type { house } from "./external/houses/types";
import type { planet } from "./external/planets/types";
import type { aspect, aspectedTo } from "./external/aspects/types";
import { aspectProperties } from "./external/aspects/properties";


export const Signs = [
  { sign: "Aries", unicode: '\u2648', angle: 0, domicile: "Mars", exaltation: "Sun", triplicity_day: "Sun", 
    triplicity_night: "Jupiter", detriment: "Venus", fall: "Saturn", 
    terms: [["true Node", 6], ["Venus", 14], ["Mercury", 21], ["Mars", 26], ["Saturn", 30]], faces: ["Mars", "Sun", "Venus"] },
  { sign: "Taurus", unicode: '\u2649', angle: 30, domicile: "Venus", exaltation: "Moon", triplicity_day: "Venus", 
    triplicity_night: "Moon", detriment: "Mars", fall: "none", 
    terms: [["Venus", 8], ["Mercury", 15], ["Jupiter", 22], ["Saturn", 26], ["Mars", 30]], faces: ["Mercury", "Moon", "Saturn"] },
  { sign: "Gemini", unicode: '\u264A', angle: 60, domicile: "Mercury", exaltation: "none", triplicity_day: "Saturn", 
    triplicity_night: "Mercury", detriment: "Jupiter", fall: "none", 
    terms: [["Mercury", 7], ["Jupiter", 14], ["Venus", 21], ["Saturn", 25], ["Mars", 30]], faces: ["Jupiter", "Mars", "Sun"] },
  { sign: "Cancer", unicode: '\u264B', angle: 90, domicile: "Moon", exaltation: "Jupiter", triplicity_day: "Mars", 
    triplicity_night: "Mars", detriment: "Saturn", fall: "Mars", 
    terms: [["Mars", 6], ["Jupiter", 13], ["Mercury", 20], ["Venus", 27], ["Saturn", 30]], faces: ["Venus", "Mercury", "Moon"] },
  { sign: "Leo", unicode: '\u264C', angle: 120, domicile: "Sun", exaltation: "none", triplicity_day: "Sun", 
    triplicity_night: "Jupiter", detriment: "Saturn", fall: "none", 
    terms: [["Saturn", 6], ["Mercury", 13], ["Venus", 19], ["Jupiter", 25], ["Mars", 30]], faces: ["Sun", "Venus", "Mercury"] },
  { sign: "Virgo", unicode: '\u264D', angle: 150, domicile: "Mercury", exaltation: "Mercury", triplicity_day: "Venus", 
    triplicity_night: "Moon", detriment: "Jupiter", fall: "Venus", 
    terms: [["Mercury", 7], ["Venus", 13], ["Jupiter", 18], ["Saturn", 24], ["Mars", 30]], faces: ["Sun", "Venus", "Mercury"] },
  { sign: "Libra", unicode: '\u264E', angle: 180, domicile: "Venus", exaltation: "Saturn", triplicity_day: "Saturn", 
    triplicity_night: "Mercury", detriment: "Mars", fall: "Sun", 
    terms: [["Saturn", 6], ["Venus", 11], ["Jupiter", 19], ["Mercury", 24], ["Mars", 30]], faces: ["Moon", "Saturn", "Jupiter"] },
  { sign: "Scorpio", unicode: '\u264F', angle: 210, domicile: "Mars", exaltation: "none", triplicity_day: "Mars", 
    triplicity_night: "Mars", detriment: "Venus", fall: "Moon", 
    terms: [["Mars", 6], ["Jupiter", 14], ["Venus", 21], ["Mercury", 27], ["Saturn", 30]], faces: ["Mars", "Sun", "Venus"] },
  { sign: "Sagittarius", unicode: '\u2650', angle: 240, domicile: "Jupiter", exaltation: "none", triplicity_day: "Sun", 
    triplicity_night: "Jupiter", detriment: "Mercury", fall: "none", 
    terms: [["Jupiter", 8], ["Venus", 14], ["Mercury", 19], ["Saturn", 25], ["Mars", 30]], faces: ["Mercury", "Moon", "Saturn"] },
  { sign: "Capricorn", unicode: '\u2651', angle: 270, domicile: "Saturn", exaltation: "Mars", triplicity_day: "Venus", 
    triplicity_night: "Moon", detriment: "Moon", fall: "Jupiter", 
    terms: [["Venus", 6], ["Mercury", 12], ["Jupiter", 19], ["Mars", 25], ["Saturn", 30]], faces: ["Jupiter", "Mars", "Sun"] },
  { sign: "Aquarius", unicode: '\u2652', angle: 300, domicile: "Saturn", exaltation: "none", triplicity_day: "Saturn", 
    triplicity_night: "Mercury", detriment: "Sun", fall: "none", 
    terms: [["Saturn", 6], ["Mercury", 12], ["Venus", 20], ["Jupiter", 25], ["Mars", 30]], faces: ["Venus", "Mercury", "Moon"] },
  { sign: "Pisces", unicode: '\u2653', angle: 330, domicile: "Jupiter", exaltation: "Venus", triplicity_day: "Mars", 
    triplicity_night: "Mars", detriment: "Mercury", fall: "Mercury", 
    terms: [["Venus", 8], ["Jupiter", 14], ["Mercury", 20], ["Mars", 26], ["Saturn", 30]], faces: ["Saturn", "Jupiter", "Mars"] },
];

export const mod360 = (value: number) => {
  const result = value % 360;
  if(result === -0){
    return 0;
  }
  return result >= 0 ? result : result + 360;
};

export const signFromPos = (long: number) => {
  let mySign = { sign: "Pisces", angle: 330 };
  let stop = false;
  Signs.forEach((sign, idx) => {
    if (mod360(long) < sign.angle && stop === false) {
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
  const drawHousePositions = onlyHouses.map((house) => mod360(house.position - ascPos(houses))).sort((a, b) => a - b);
  return drawHousePositions;
};

export const findHorizon = (houses: house[]) => {
  const ascendant = houses.find((house) => house.name === "house  1");
  const descendant = houses.find((house) => house.name === "house  7");
  const ascendantPos = (mod360(ascendant ? ascendant.position : null) + 3);
  const descendantPos = (mod360(descendant ? descendant.position : null) - 3);
  const horizon = [ascendantPos, descendantPos];
  return horizon;
};

export const dayOrNight = (planets: planet[], houses: house[]) => {
  const sun = planets.find((planet) => planet.name === "Sun");
  const sunPos = sun ? sun.position : null;
  const horizon = findHorizon(houses);
  let dayOrNight: string;
  if (mod360(sunPos) >= horizon[1] || mod360(sunPos) <= horizon[0]) {
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

export function getAllTermSymbols (planets: planet[]) {
  const allTerms: string[] = [];

  Signs.forEach((sign) => {
    sign.terms.forEach((term) => {
      const planetName = term[0];
      const planet = planets.find((planet) => planet.name === planetName);
      if (planet) {
        allTerms.push(planet.unicode);
      }
    }, []);
  });
  return allTerms;
}

export function getAllTermPositions() {
  const allTermPos: number[] = [];

  Signs.forEach((sign) => {
    sign.terms.forEach((term) => {
      const position = term[1] as number;
      allTermPos.push(position);

    });
  });
  return allTermPos;
}

export function getAllTermAngles(signAngles: number[]) {
  const termsPositionArray = getAllTermPositions()
  const termAngles: number[] = [];
  if (signAngles.length * 5 === termsPositionArray.length) {
    for (let j = 0; j < termsPositionArray.length; j++) {
      const signAngle = signAngles[Math.floor(j / 5)];
      if (termsPositionArray[j] === 30) {
        termAngles.push(signAngle + 30);
      } else {
        termAngles.push(signAngle + termsPositionArray[j]);
      }
    }
  return termAngles;
  }
}

export const antisciaPosition = (long: number) => {
  return mod360(90 - (long - 90));
};

export const getOposition = (antiscia: number) => {
  return mod360(antiscia + 180);
};
export const signAngles = (houses: house[]) => {  
  const drawSignPositions = Signs.map((sign) => mod360(sign.angle - ascPos(houses)));
  return drawSignPositions;
};

export const planetPositions = (planets: planet[], houses: house[]) => {  
  const drawSignPositions = planets.map((planet) => mod360(planet.position - ascPos(houses)));
  return drawSignPositions;
};

export const planetAntiscia = (planets: planet[], houses: house[]) => {
  const drawAntisciaPositions = planets.map((planet) => mod360(antisciaPosition(planet.position) - ascPos(houses)));
  return drawAntisciaPositions;
};

export const planetContraAntiscia = (planets: planet[], houses: house[]) => {
  const drawContraAntisciaPositions = planets.map((planet) => mod360(getOposition(planet.position) - ascPos(houses)));
  return drawContraAntisciaPositions;
};

export const decToDMS = (long: number) => {
  const mySign = signFromPos(long);
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

export const getAngle = (position:number, ascendant: number) => {
  return mod360(((position - ascendant) + 180) * -1);
}

export function getOtherEntities(aspects: aspect[], astroType: string, astroName: string) {
  const otherEntities = aspects.flatMap((aspect) => {
    if (aspect.astrotypeA === astroType && aspect.astronameA === astroName) {
      return {
        aspect: aspect.typeOfAspect,
        astrotype: aspect.astrotypeB,
        astroname: aspect.astronameB,
        position: aspect.positionB,
        angle: aspect.angleB,
      };
    }
    if (aspect.astrotypeB === astroType && aspect.astronameB === astroName) {
      return {
        aspect: aspect.typeOfAspect,
        astrotype: aspect.astrotypeA,
        astroname: aspect.astronameA,
        position: aspect.positionA,
        angle: aspect.angleA,
      };
    }
    return [];
  });

  return otherEntities as aspectedTo[];
}

export function aspectedToTableString(aspects: aspectedTo[]) {
  if(aspects.length === 0) {
    return "None";
  }

  const aspectString:string[] = [];
  for(let i = 0; i < aspects.length; i++) {
    const aspect = aspects[i];
    aspectString.push(`${getAspectUnicode(aspect.aspect)} ${aspect.astroname}(${aspect.astrotype})`);
  }
  return aspectString.join("\n");
}

export function getAspectString(aspects: aspect[], astroType: string, astroName: string) {
  const otherEntities = getOtherEntities(aspects, astroType, astroName);
  return aspectedToTableString(otherEntities);
}

export function getAspectUnicode(aspectType: string) {
  const matchedAspect = aspectProperties.find((aspect) => aspect.type === aspectType);
  return matchedAspect ? matchedAspect.unicode : '';
}

