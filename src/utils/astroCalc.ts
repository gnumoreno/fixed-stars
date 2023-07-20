import { Sign } from "crypto";
import { house } from "~/server/api/routers/houses";
import { planet } from "~/server/api/routers/planets";
import { majorStar } from "~/server/api/routers/stars";

const Signs = [
  { sign: "Aries", angle: 0 },
  { sign: "Taurus", angle: 30 },
  { sign: "Gemini", angle: 60 },
  { sign: "Cancer", angle: 90 },
  { sign: "Leo", angle: 120 },
  { sign: "Virgo", angle: 150 },
  { sign: "Libra", angle: 180 },
  { sign: "Scorpio", angle: 210 },
  { sign: "Sagittarius", angle: 240 },
  { sign: "Capricorn", angle: 270 },
  { sign: "Aquarius", angle: 300 },
  { sign: "Pisces", angle: 330 },
];

// const aspectType = [
//   { name: "conjunction", angle: 0, unicode: "u260C" },
//   { name: "sextile", angle: 60, unicode: "u26B9" },
//   { name: "square", angle: 90, unicode: "u25A1" },
//   { name: "trine", angle: 120, unicode: "u25B3" },
//   { name: "oposition", angle: 180, unicode: "u260D" },
// ];

export const signOver = (dec: number) => {
  const cycle = dec % 360;
  return cycle;
};
export const signFromDec = (long: number) => {
  let mySign = { sign: "Pisces", angle: 330 };
  let stop = false;
  Signs.forEach((sign, idx) => {
    if (signOver(long) < sign.angle && stop === false) {
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

}

const calculateModulo360becauseJSisStupid = (value: number) => {
  const result = value % 360;
  return result >= 0 ? result : result + 360;
};

export const housePositions = (houses: house[]) => {  
  const ascendant = houses.find((house) => house.name === "house  1");
  const ascendantPos = ascendant ? ascendant.position : null;
  const onlyHouses = houses.filter(house => house.name.includes("house"));
  const drawHousePositions = onlyHouses.map((house) => calculateModulo360becauseJSisStupid(house.position - ascendantPos)).sort((a, b) => a - b);
  // console.log("house positions:", ascendant, ascendantPos, onlyHouses, drawHousePositions)
  return drawHousePositions;
}

export const signPositions = (houses: house[]) => {  
  const ascendant = houses.find((house) => house.name === "house  1");
  const ascendantPos = ascendant ? ascendant.position : null;
  const drawSignPositions = Signs.map((sign) => calculateModulo360becauseJSisStupid(sign.angle - ascendantPos)).sort((a, b) => a - b);
  // console.log("sign positions:", ascendant, ascendantPos, drawSignPositions)
  return drawSignPositions;
}

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

export const dmsToDec = (degrees: number, minutes: number, seconds: number): number => {
  const sign = degrees < 0 ? -1 : 1; // Determine the sign of the degrees
  const positiveDegrees = Math.abs(degrees); // Convert degrees to positive value for calculation
  const decimal = positiveDegrees + (minutes / 60) + (seconds / 3600);
  return decimal * sign; // Apply the sign to the calculated decimal value
};

export const antiscia = (long: number) => {
  return (90 - (long - 90)) % 360;
}

export const contraantiscia = (antiscia: number) => {
  return (antiscia + 180) % 360;
}
