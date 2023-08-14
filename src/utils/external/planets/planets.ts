import { env } from "~/env.mjs";
import type { house } from "../houses/types";
import type { PlanetProperties, planet, planetAPI, planetBase } from "./types";
import { decToDMS, getAngle, houseFromDec, getOposition, dayOrNight } from "~/utils/astroCalc";
import { planets } from "./properties";
import { getDignities } from "../dignities/dignities";

export const getPlanetsData = async (
    date: string,
    time: string,
    latitude: number,
    longitude: number,
    altitude: number,
    houseSystem: string,
    housesData: house[],
    ascendantPos: number,
) => {
    const planetsURL = `${env.GO_API_ENDPOINT}/run-planets?birthdate=${date}&utctime=${time}&latitude=${latitude}&longitude=${longitude}&altitude=${altitude}&housesystem=${houseSystem}`


    const planetsArrayResponse = await fetch(planetsURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const planetsArray = await planetsArrayResponse.json() as planetAPI[]

    // There must be a better way to do this
    const trueNode = planetsArray.find(planet => planet.name === "true Node");
    const trueNodePosition = trueNode ? parseFloat(trueNode.longitude) : 0;
    const southNodePosition = getOposition(trueNodePosition);
    const southNodeObject: planetAPI = {
        name: "south Node",
        latitude: "0",
        longitude: southNodePosition.toString(),
        dailySpeed: "0",
    };
    planetsArray.splice(8, 0, southNodeObject);

   

    const planetsTmp = planetsArray.map((planet) => {
        const long = parseFloat(planet.longitude);
        const tmp = decToDMS(long);
        const house = houseFromDec(housesData, long)
        const planetProps = planets.find((p) => p.name === planet.name) || {
            unicode: "",
            temperature: "",
            humidity: "",
            element: "",
        } as PlanetProperties;

        const result = {
            name: planet.name,
            position: long,
            angle: getAngle(long, ascendantPos),
            orb: 3,
            sign: tmp.sign,
            longDegree: tmp.signDegree,
            longMinute: tmp.signMinute,
            longSecond: tmp.signSecond,
            house: house,
            lat: parseFloat(planet.latitude),
            speed: parseFloat(planet.dailySpeed),
            unicode: planetProps.unicode,
            temperature: planetProps.temperature,
            humidity: planetProps.humidity,
            element: planetProps.element,
        } as planetBase;
        return result
    }).slice(0, 9)


    const isDay = dayOrNight(planetsTmp, housesData)
    const planetsData = planetsTmp.map(planet => {
        const receptions = getDignities(planet.name, planet.sign,planet.longDegree,isDay)
        return  {
            ...planet,
            dom: receptions.domicile,
            exalt: receptions.exaltation,
            trip: receptions.triplicity,
            term: receptions.term,
            face: receptions.face,
            detriment: receptions.detriment,
            fall: receptions.fall,
        }
    })

    return planetsData as planet[];
}