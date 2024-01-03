import { env } from "~/env.mjs";
import type { house } from "../houses/types";
import type { PlanetProperties, planet, planetAPI, planetBase } from "./types";
import { decToDMS, getAngle, houseFromDec, getOposition, dayOrNight } from "~/utils/astroCalc";
import { planets } from "./properties";
import { getDignities } from "../dignities/dignities";
import sweph from "sweph";

export const getPlanetsData = (
    julianDay: number,
    housesData: house[],
    ascendantPos: number,
) => {
    const planetsWithSwephCodes = planets.filter((planet) => planet.swephCode !== null);

    const planetCalcFlags = sweph.constants.SEFLG_SWIEPH | sweph.constants.SEFLG_SPEED;
    const planetsArray: planetAPI[] = planetsWithSwephCodes.map((planet) => {
        const planetPositionData = sweph.calc_ut(julianDay, planet.swephCode, planetCalcFlags);

        const [longitude, latitude, _distance, speed, ..._rest] = planetPositionData.data;

        return {
            name: planet.name,
            latitude,
            longitude,
            dailySpeed: speed,
        }
    });

    // There must be a better way to do this
    const trueNode = planetsArray.find(planet => planet.name === "true Node");
    const trueNodePosition = trueNode ? trueNode.longitude : 0;
    const southNodePosition = getOposition(trueNodePosition);
    const southNodeObject: planetAPI = {
        name: "south Node",
        latitude: 0,
        longitude: southNodePosition,
        dailySpeed: 0,
    };
    planetsArray.push(southNodeObject);

   

    const planetsTmp = planetsArray.map((planet) => {
        const long = planet.longitude;
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
            lat: planet.latitude,
            speed: planet.dailySpeed,
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