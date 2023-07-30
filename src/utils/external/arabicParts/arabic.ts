import { mod360, houseFromDec, decToDMS, type DMSObj, getAngle } from "~/utils/astroCalc";
import type { house } from "../houses/types";
import type { planet } from "../planets/types";
import type { arabicPart } from "./types";
import { ArabicPartProperties } from "./properties";
// Individual functions to calculate each Arabic Part

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
  function calculateValor(ascendant: number, sun: number, moon: number, mars: number): number {
    const fortuna = calculateFortuna(ascendant, sun, moon);
    return ascendant + (fortuna - mars);
  }
  
  // Function to calculate Victory Arabic Part
  function calculateVictory(ascendant: number, sun: number, moon: number, jupiter: number): number {
    const spirit = calculateSpirit(ascendant, sun, moon);
    return ascendant + (jupiter - spirit);
  }
  
  // Function to calculate Captivity Arabic Part
  function calculateCaptivity(ascendant: number, sun: number, moon: number, saturn: number): number {
    const fortuna = calculateFortuna(ascendant, sun, moon);
    return ascendant + (fortuna - saturn);
  }
  
  // Function to calculate all Arabic Parts
  export function getArabicPartArray(
    housesData: house[] | null,
    planetsData: planet[] | null
  ): arabicPart[] {
    if (!housesData || !planetsData) {
      return [];
    }
  
    const ascendant = housesData[0]?.position || 0;
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
          position = mod360(calculateSpirit(ascendant, sun, moon));
          break;
        case "Fortuna":
          position = mod360(calculateFortuna(ascendant, sun, moon));
          break;
        case "Necessity":
          position = mod360(calculateNecessity(ascendant, sun, moon));
          break;
        case "Love":
          position = mod360(calculateLove(ascendant, sun, moon));
          break;
        case "Valor":
          position = mod360(calculateValor(ascendant, sun, moon, mars));
          break;
        case "Victory":
          position = mod360(calculateVictory(ascendant, sun, moon, jupiter));
          break;
        case "Captivity":
          position = mod360(calculateCaptivity(ascendant, sun, moon, saturn));
          break;
        default:
          position = 0;
      }

    // Calculate the sign, longDegree, longMinute, and longSecond values using decToDMS
    const dmsObj: DMSObj = decToDMS(mod360(position + ascendant));
    const { sign, signDegree: degree, signMinute: minute, signSecond: second } = dmsObj;

    // Calculate the house value using houseFromDec
    const house = houseFromDec(housesData, position);

    arabicParts.push({
      name: part.name,
      unicode: part.unicode,
      formula: part.formula,
      position: position,
      angle: getAngle(position, ascendant),
      orb: 3,
      sign: sign,
      longDegree: degree,
      longMinute: minute,
      longSecond: second,
      house: house,
    });
  }

  return arabicParts;
}