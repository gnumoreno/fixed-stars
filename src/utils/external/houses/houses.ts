import { env } from "~/env.mjs"
import { decToDMS } from "~/utils/astroCalc"
import { type house, type houseAPI } from "./types"



export const getHousesData = async (
    date: string,
    time: string,
    latitude: number,
    longitude: number,
    altitude: number,
    houseSystem: string,
) => {
    const housesURL = `${env.GO_API_ENDPOINT}/run-houses?birthdate=${date}&utctime=${time}&latitude=${latitude}&longitude=${longitude}&altitude=${altitude}&housesystem=${houseSystem}`
    const housesArrayResponse = await fetch(housesURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const housesArray = await housesArrayResponse.json() as houseAPI[]

    return housesArray.map((house) => {
        const long = parseFloat(house.longitude);
        const tmp = decToDMS(long);
        const result = {
            name: house.name,
            position: long,
            sign: tmp.sign,
            longDegree: tmp.signDegree,
            longMinute: tmp.signMinute,
            longSecond: tmp.signSecond,
        } as house;
        return result
    })
}