import { env } from "~/env.mjs";
import { majorStars } from "./properties";
import type { majorStar, majorStarResponse } from "./types";
import { decToDMS, houseFromDec } from "~/utils/astroCalc";
import type { house } from "../houses/types";



export const getStarsData = async (date: string, time: string, houses: house[]) => {

    const starsURL = `${env.GO_API_ENDPOINT}/run-star?birthdate=${date}&utctime=${time}&stars=${majorStars.join(',')}`

    const starsArrayResponse = await fetch(starsURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const starsArray = await starsArrayResponse.json() as majorStarResponse[];

    return starsArray.map(star => {
        const tmp = decToDMS(parseFloat(star.longitude));
        // const long = parseFloat(star.longitude);
        const longitude = parseFloat(star.longitude);
        const starHouse = houseFromDec(houses, longitude);
        const result: majorStar = {
            star: star.starName,
            constellation: star.altName,
            position: longitude,
            distance: parseFloat(star.distance),
            house: Number(starHouse),
            lat: parseFloat(star.latitude),
            magnitude: parseFloat(star.magnitude),
            speed: parseFloat(star.speed),
            sign: tmp.sign,
            longDegree: tmp.signDegree,
            longMinute: tmp.signMinute,
            longSecond: tmp.signSecond,

        }

        return result
    })
}