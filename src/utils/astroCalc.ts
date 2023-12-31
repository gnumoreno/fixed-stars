import type { house } from "./external/houses/types";
import type { planet, planetBase } from "./external/planets/types";
import type { aspect, aspectDetails, aspectedTo } from "./external/aspects/types";
import { aspectProperties } from "./external/aspects/properties";
import { Signs } from "./external/dignities/properties";

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
  return parseFloat(myHouse.name.split(" ").pop());

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

export const dayOrNight = (planets: planetBase[], houses: house[]) => {
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

export function getStarAspects(aspects: aspect[]) {
  const starAspects = aspects.filter((aspect) => {
    return aspect.astrotypeA === "star" || aspect.astrotypeB === "star";
  });
  
  // Map the filtered data to extract the required information for each side of the aspect
  const starAspectDetails: aspectDetails[] = starAspects.map((aspect) => {
    const astroA = {
      name: aspect.astronameA,
      angle: aspect.angleA,
      aspectType: aspect.typeOfAspect,
      aspectedAstro: aspect.astrotypeB === "star" ? aspect.astronameB : null,
    };
  
    const astroB = {
      name: aspect.astronameB,
      angle: aspect.angleB,
      aspectType: aspect.typeOfAspect,
      aspectedAstro: aspect.astrotypeA === "star" ? aspect.astronameA : null,
    };
  
    return { astroA, astroB };
  });
  return starAspectDetails;
}

export function aspectedToTableString(aspects: aspectedTo[]) {
  if(aspects.length === 0) {
    return "None";
  }

  const aspectString:string[] = [];
  for(let i = 0; i < aspects.length; i++) {
    const aspect = aspects[i];
    aspectString.push(`${getAspectUnicode(aspect.aspect)} ${aspect.astroname} (${aspect.astrotype})`);
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

