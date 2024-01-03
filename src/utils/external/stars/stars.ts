import { stars } from "./properties";
import type { star, starAPI } from "./types";
import { decToDMS, getAngle, houseFromDec } from "~/utils/astroCalc";
import type { house } from "../houses/types";
import sweph from "sweph";

export const getStarsData = (
    julianDay: number,
    houses: house[],
    ascendantPos: number) => {
    const starNames = stars.map((star) => star.name).filter((name) => {
        const isPlanet = name === "Pluto" || name === "Neptune" || name === "Uranus";
        return !isPlanet;
    });

    const starCalcFlags = sweph.constants.SEFLG_SWIEPH | sweph.constants.SEFLG_SPEED;
    const starsArray: starAPI[] = starNames
        .map<starAPI>(star => {
        const starPositionData = sweph.fixstar2_ut(star, julianDay, starCalcFlags);

        const [starName, altName] = starPositionData.name.split(",");
        const [longitude, latitude, distance, speed, ..._rest] = starPositionData.data;

        const magnitude = sweph.fixstar2_mag(starName).data;

        return {
            starName,
            altName,
            longitude,
            latitude,
            distance,
            speed,
            magnitude,
            house: "",
        }
    });

    return starsArray.map(star => {
        const starProps = stars.find((s) => s.name === star.starName) || {
            name: "",
            orb: 1,
            nature: "",
            url: "",
        };
        const tmp = decToDMS(star.longitude);
        const longitude = star.longitude;
        const starHouse = houseFromDec(houses, longitude);
        const result: star = {
            name: star.starName,
            constellation: star.altName,
            position: longitude,
            angle: getAngle(longitude, ascendantPos),
            distance: star.distance,
            house: Number(starHouse),
            lat: star.latitude,
            magnitude: star.magnitude,
            speed: star.speed,
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