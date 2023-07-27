import type { PlanetProperties } from "./types";

export const planets: PlanetProperties[] = [
    { name: "Sun", unicode: '\u2609', temperature: "hot", humidity: "dry", element: "fire" },
    { name: "Moon", unicode: '\u263E', temperature: "cold", humidity: "wet", element: "water" },
    { name: "Mercury", unicode: '\u263F', temperature: "cold", humidity: "dry", element: "earth" },
    { name: "Venus", unicode: '\u2640', temperature: "cold", humidity: "wet", element: "water" },
    { name: "Mars", unicode: '\u2641', temperature: "hot", humidity: "dry", element: "fire" },
    { name: "Jupiter", unicode: '\u2643', temperature: "hot", humidity: "wet", element: "air" },
    { name: "Saturn", unicode: '\u2644', temperature: "cold", humidity: "dry", element: "earth" },
    { name: "Uranus", unicode: '\u2645', temperature: "", humidity: "", element: "" },
    { name: "Neptune", unicode: '\u2646', temperature: "", humidity: "", element: "" },
    { name: "Pluto", unicode: '\u2647', temperature: "", humidity: "", element: "" },
    { name: "true Node", unicode: '\u260A', temperature: "", humidity: "", element: "" },
  ];