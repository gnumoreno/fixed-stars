import sweph from "sweph";
import { decToDMS, getAngle } from "~/utils/astroCalc"
import { type house, type houseAPI } from "./types"

// Não tenho certeza se vai funcionar no servidor
sweph.set_ephe_path(`${process.cwd()}/ephe`);

export const getHousesData = (
    date: Date,
    time: string,
    latitude: number,
    longitude: number,
    altitude: number,
    houseSystem: string,
) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const [hours, minutes] = time.split(":");

    const hoursDec = parseInt(hours) + (parseInt(minutes) / 60);
    const julianDay = sweph.julday(year, month, day, hoursDec, sweph.constants.SE_GREG_CAL);

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