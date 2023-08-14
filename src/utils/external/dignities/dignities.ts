import { planets } from "../planets/properties";
import { Signs } from "./properties";
import type { Dignities } from "./types";

export const getDignities = (
  planetName: string,
  signName: string,
  position: number,
  isDay: string
): Dignities => {
  const planet = planets.find((p) => p.name === planetName);
  const sign = Signs.find((s) => s.sign === signName);

  if (!planet || !sign) {
    throw new Error("Invalid planet or sign name");
  }

  let faceDignity = "";
  if (sign.faces.length >= 3) {
    if (position < 10) {
      faceDignity = sign.faces[0];
    } else if (position < 20) {
      faceDignity = sign.faces[1];
    } else if (position < 30) {
      faceDignity = sign.faces[2];
    }
  }

  let termDignity = "";
  if (sign.terms.length >= 5) {
    if (position < Number(sign.terms[0][1])) {
      termDignity = sign.terms[0][0] as string;
    } else if (position < Number(sign.terms[1][1])) {
      termDignity = sign.terms[1][0] as string;
    } else if (position < Number(sign.terms[2][1] )) {
      termDignity = sign.terms[2][0] as string;
    } else if (position < Number(sign.terms[3][1])) {
      termDignity = sign.terms[3][0] as string;
    } else if (position < Number(sign.terms[4][1])) {
      termDignity = sign.terms[4][0] as string;
    }
  }

  const domicilePlanet = planets.find((p) => p.name === sign.domicile);
  const exaltationPlanet = planets.find((p) => p.name === sign.exaltation);
  const detrimentPlanet = planets.find((p) => p.name === sign.detriment);
  const fallPlanet = planets.find((p) => p.name === sign.fall);
  const triplicityPlanet = planets.find((p) => p.name === (isDay === "day" ? sign.triplicity_day : sign.triplicity_night));
  const termPlanet = planets.find((p) => p.name === termDignity);
  const facePlanet = planets.find((p) => p.name === faceDignity);


  const dignities: Dignities = {
    sign: sign.unicode,
    domicile: domicilePlanet ? domicilePlanet.unicode : "",
    exaltation: exaltationPlanet ? exaltationPlanet.unicode : "",
    detriment: domicilePlanet ? detrimentPlanet.unicode : "",
    fall: fallPlanet ? fallPlanet.unicode : "",
    triplicity: triplicityPlanet ? triplicityPlanet.unicode : "",
    term: termDignity ? termPlanet?.unicode : "",
    face: faceDignity ? facePlanet?.unicode : "",
  }

  return dignities;
  
};

