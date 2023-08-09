import { env } from "~/env.mjs";
import { stars } from "./properties";
import type { star, starAPI } from "./types";
import { decToDMS, getAngle, houseFromDec } from "~/utils/astroCalc";
import type { house } from "../houses/types";



export const getStarsData = async (date: string, time: string, houses: house[], ascendantPos: number) => {
    const starNames = stars.map((star) => star.name);
    const starsURL = `${env.GO_API_ENDPOINT}/run-star?birthdate=${date}&utctime=${time}&stars=${starNames.join(',')}`

    const starsArrayResponse = await fetch(starsURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const starsArray = await starsArrayResponse.json() as starAPI[];

    return starsArray.map(star => {
        const starProps = stars.find((s) => s.name === star.starName) || {
            name: "",
            orb: 1,
            nature: "",
            url: "",
        };
        const tmp = decToDMS(parseFloat(star.longitude));
        // const long = parseFloat(star.longitude);
        const longitude = parseFloat(star.longitude);
        const starHouse = houseFromDec(houses, longitude);
        const result: star = {
            name: star.starName,
            constellation: star.altName,
            position: longitude,
            angle: getAngle(longitude, ascendantPos),
            distance: parseFloat(star.distance),
            house: Number(starHouse),
            lat: parseFloat(star.latitude),
            magnitude: parseFloat(star.magnitude),
            speed: parseFloat(star.speed),
            sign: tmp.sign,
            longDegree: tmp.signDegree,
            longMinute: tmp.signMinute,
            longSecond: tmp.signSecond,
            orb: starProps.orb,
            nature: starProps.nature,
            url: starProps.url,
        }

        return result
    })
}