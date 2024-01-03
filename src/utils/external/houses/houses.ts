import sweph from "sweph";
import { decToDMS, getAngle } from "~/utils/astroCalc"
import { type house, type houseAPI } from "./types"



export const getHousesData = (
    julianDay: number,
    latitude: number,
    longitude: number,
    altitude: number,
    houseSystem: string,
) => {
    const housesData = sweph.houses(julianDay, latitude, longitude, houseSystem);
    const housesArray: houseAPI[] = housesData.data.houses.map((longitude, i) => ({ name: `house  ${i + 1}`, longitude }));

    const ascendantPos = housesArray[0].longitude;
    return housesArray.map((house) => {
        const long = house.longitude;
        const tmp = decToDMS(long);
        const result = {
            name: house.name,
            position: long,
            angle: getAngle(long, ascendantPos),
            orb: 3,
            sign: tmp.sign,
            longDegree: tmp.signDegree,
            longMinute: tmp.signMinute,
            longSecond: tmp.signSecond,
        } as house;
        return result
    }).slice(0, 12)
}