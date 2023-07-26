import { type house } from "~/server/api/routers/houses";
import { type planet } from "~/server/api/routers/planets";
import { houseFromDec, decToDMS, type DMSObj } from "~/utils/astroCalc";

export const ArabicPartProperties = [  
    { name: "Spirit", unicode: '\u24E2', formula: "Ascendant + (Sun - Moon)" },
    { name: "Fortuna", unicode: '\u2297', formula: "Ascendant + (Moon - Sun)" },
    { name: "Necessity", unicode: '\u24DD', formula: "Ascendant + (Fortuna - Spirit)" },
    { name: "Love", unicode: '\u24C1', formula: "Ascendant + (Spirit - Fortuna)" },
    { name: "Valor", unicode: '\u24E5', formula: "Ascendant + (Fortuna - Mars)" },
    { name: "Victory", unicode: '\u24CB', formula: "Ascendant + (Jupiter - Spirit)" },
    { name: "Captivity", unicode: '\u24D2', formula: "Jupiter + (Saturn - Sun)" },
  ];

  export type arabicPart = {
    name: string;
    unicode: string;
    formula: string;
    position: number;
    sign: string;
    longDegree: number;
    longMinute: number;
    longSecond: number;
    house: string;
  };

// Function to calculate Spirit Arabic Part
function calculateSpirit(ascendant: number, sun: number, moon: number): number {
    return ascendant + (sun - moon);
  }
  
  // Function to calculate Fortuna Arabic Part
  function calculateFortuna(ascendant: number, sun: number, moon: number): number {
    return ascendant + (moon - sun);
  }
  
  // Function to calculate Necessity Arabic Part
  function calculateNecessity(ascendant: number, sun: number, moon: number): number {
    const spirit = calculateSpirit(ascendant, sun, moon);
    const fortuna = calculateFortuna(ascendant, sun, moon);
    return ascendant + (fortuna - spirit);
  }
  
  // Function to calculate Love Arabic Part
  function calculateLove(ascendant: number, sun: number, moon: number): number {
    const spirit = calculateSpirit(ascendant, sun, moon);
    const fortuna = calculateFortuna(ascendant, sun, moon);
    return ascendant + (spirit - fortuna);
  }
  
  // Function to calculate Valor Arabic Part
  function calculateValor(ascendant: number, sun: number, mars: number): number {
    const fortuna = calculateFortuna(ascendant, sun, mars);
    return ascendant + (fortuna - mars);
  }
  
  // Function to calculate Victory Arabic Part
  function calculateVictory(ascendant: number, sun: number, moon: number, jupiter: number): number {
    const spirit = calculateSpirit(ascendant, sun, moon);
    return ascendant + (jupiter - spirit);
  }
  
  // Function to calculate Captivity Arabic Part
  function calculateCaptivity(jupiter: number, sun: number, saturn: number): number {
    return jupiter + (saturn - sun);
  }
  
  // Function to calculate all Arabic Parts
  export function getArabicPartArray(
    housesData: house[] | null,
    planetsData: planet[] | null
  ): arabicPart[] {
    if (!housesData || !planetsData) {
      return [];
    }
  
    const ascendant = housesData[12]?.position || 0;
    const sun = planetsData.find(planet => planet.name === "Sun")?.position || 0;
    const moon = planetsData.find(planet => planet.name === "Moon")?.position || 0;
    const mars = planetsData.find(planet => planet.name === "Mars")?.position || 0;
    const jupiter = planetsData.find(planet => planet.name === "Jupiter")?.position || 0;
    const saturn = planetsData.find(planet => planet.name === "Saturn")?.position || 0;
  
    const arabicParts: arabicPart[] = [];
  
    for (const part of ArabicPartProperties) {
      let position = 0;
      switch (part.name) {
        case "Spirit":
          position = calculateSpirit(ascendant, sun, moon);
          break;
        case "Fortuna":
          position = calculateFortuna(ascendant, sun, moon);
          break;
        case "Necessity":
          position = calculateNecessity(ascendant, sun, moon);
          break;
        case "Love":
          position = calculateLove(ascendant, sun, moon);
          break;
        case "Valor":
          position = calculateValor(ascendant, sun, mars);
          break;
        case "Victory":
          position = calculateVictory(ascendant, sun, moon, jupiter);
          break;
        case "Captivity":
          position = calculateCaptivity(jupiter, sun, saturn);
          break;
        default:
          position = 0;
      }

    // Calculate the sign, longDegree, longMinute, and longSecond values using decToDMS
    const dmsObj: DMSObj = decToDMS(position);
    const { sign, signDegree: degree, signMinute: minute, signSecond: second } = dmsObj;

    // Calculate the house value using houseFromDec
    const house = houseFromDec(housesData, position);

    arabicParts.push({
      name: part.name,
      unicode: part.unicode,
      formula: part.formula,
      position,
      sign,
      longDegree: degree,
      longMinute: minute,
      longSecond: second,
      house,
    });
  }

  return arabicParts;
}