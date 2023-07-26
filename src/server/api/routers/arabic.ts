import { type house } from "~/server/api/routers/houses";
import { type planet } from "~/server/api/routers/planets";
import math from 'mathjs';

export const ArabicPartProperties = [  
    { name: "Spirit", unicode: 'spi', formula: "Ascendant + (Sun - Moon)" },
    { name: "Fortuna", unicode: 'for', formula: "Ascendant + (Moon - Sun)" },
    { name: "Necessity", unicode: 'nec', formula: "Ascendant + (Fortuna - Spirit)" },
    { name: "Love", unicode: 'lov', formula: "Ascendant + (Spirit - Fortuna)" },
    { name: "Valor", unicode: 'val', formula: "Ascendant + (Fortuna - Mars)" },
    { name: "Victory", unicode: 'vic', formula: "Ascendant + (Jupiter - Spirit)" },
    { name: "Captivity", unicode: 'cap', formula: "Jupiter + (Saturn - Sun)" },
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
  
  // Function to calculate a single Arabic Part based on its formula
  function calculateArabicPart(formula: string, ...args: number[]): number {
    return math.evaluate(formula, { ...args });
  }
  
  // Function to calculate all Arabic Parts
  export function getArabicPartArray(
    housesData: house[] | null,
    planetsData: planet[] | null
  ): arabicPart[] {
    if (!housesData || !planetsData) {
      return [];
    }
  
    const ascendant = housesData[12]?.ascendant || 0;
    const sun = planetsData.find(planet => planet.name === "Sun")?.position || 0;
    const moon = planetsData.find(planet => planet.name === "Moon")?.position || 0;
    const mars = planetsData.find(planet => planet.name === "Mars")?.position || 0;
    const jupiter = planetsData.find(planet => planet.name === "Jupiter")?.position || 0;
    const saturn = planetsData.find(planet => planet.name === "Saturn")?.position || 0;
  
    const arabicParts: arabicPart[] = [];
  
    for (const part of ArabicPartProperties) {
      let position;
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
  
      arabicParts.push({
        name: part.name,
        unicode: part.unicode,
        formula: part.formula,
        position,
        sign: "", // You can calculate the sign based on the position if needed.
        longDegree: 0, // You can calculate the degree based on the position if needed.
        longMinute: 0, // You can calculate the minute based on the position if needed.
        longSecond: 0, // You can calculate the second based on the position if needed.
        house: "", // You can calculate the house based on the position if needed.
      });
    }
  
    return arabicParts;
  }