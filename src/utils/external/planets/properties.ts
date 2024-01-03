import type { PlanetProperties } from "./types";
import {constants} from "sweph";

export const planets: PlanetProperties[] = [
    { name: "Sun", unicode: '\u2609', temperature: "hot", humidity: "dry", element: "fire", swephCode: constants.SE_SUN },
    { name: "Moon", unicode: '\u263E', temperature: "cold", humidity: "wet", element: "water", swephCode: constants.SE_MOON },
    { name: "Mercury", unicode: '\u263F', temperature: "cold", humidity: "dry", element: "earth", swephCode: constants.SE_MERCURY },
    { name: "Venus", unicode: '\u2640', temperature: "cold", humidity: "wet", element: "water", swephCode: constants.SE_VENUS },
    { name: "Mars", unicode: '\u2641', temperature: "hot", humidity: "dry", element: "fire", swephCode: constants.SE_MARS },
    { name: "Jupiter", unicode: '\u2643', temperature: "hot", humidity: "wet", element: "air", swephCode: constants.SE_JUPITER },
    { name: "Saturn", unicode: '\u2644', temperature: "cold", humidity: "dry", element: "earth", swephCode: constants.SE_SATURN },
    // { name: "Uranus", unicode: '\u2645', temperature: "", humidity: "", element: "", swephCode: constants.SE_URANUS },
    // { name: "Neptune", unicode: '\u2646', temperature: "", humidity: "", element: "", swephCode: constants.SE_NEPTUNE },
    // { name: "Pluto", unicode: '\u2647', temperature: "", humidity: "", element: "", swephCode: constants.SE_PLUTO },
    { name: "true Node", unicode: '\u260A', temperature: "", humidity: "", element: "", swephCode: constants.SE_TRUE_NODE },
    { name: "south Node", unicode: '\u260B', temperature: "", humidity: "", element: "", swephCode: null },
  ];