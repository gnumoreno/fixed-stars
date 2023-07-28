import React, { useState } from "react";
import Style from "./Index.module.css";
import type { star } from "~/utils/external/stars/types";
import type { house } from "~/utils/external/houses/types";
import type { planet } from "~/utils/external/planets/types";
import { type aspect } from "~/utils/external/aspects/types";
import { getAspectString } from "~/utils/astroCalc";


type HousesTableProps = {
    housesArray: house[];
    aspects: aspect[];
};

export const HousesTable: React.FC<HousesTableProps> = ({ housesArray, aspects }) => {
    type sortOptions =
        | "name"
        | "long"
        | "lat"
        | "speed"
        | "sign";

    const [sort, setSort] = useState<sortOptions>("long");

    const sortedArray = (housesArray: house[]) => {
        const output = housesArray;
        return output
            .sort((a, b) => {

                if (a[sort] < b[sort]) return -1;
                if (a[sort] > b[sort]) return 1;
                return 0;
            })
            .map((house, index) => (
                <tr className={Style.tr} key={index}>
                    <td className={Style.td} style={{ minWidth: "150px", maxWidth: "150px" }} title={house.name}>{limitCharacters(house.name)}</td>
                    <td className={Style.td}>{house.position}</td>
                    <td className={Style.td}>{house.sign}</td>
                    <td className={Style.td} style={{ minWidth: "130px" }}>{house.longDegree}° {house.longMinute}&lsquo; {house.longSecond}&quot;</td>
                    <td className={Style.td}>{getAspectString(aspects, 'house', house.name)}</td>
                </tr>
            ));
    };

    const limitCharacters = (string: string) => {
        if (string.length >= 120) {
            return string.slice(120).concat('...')
        }

        return string
    }

    return (
        <div className={Style.tableContainer}>
            <table className={Style.table}>
                <thead>
                    <tr className={Style.thead}>
                        <th className={Style.th} style={{ minWidth: "150px", maxWidth: "150px" }} onClick={() => setSort("name")}>house</th>
                        <th className={Style.th} onClick={() => setSort("long")}>Long (decimal)</th>
                        <th className={Style.th} onClick={() => setSort("sign")}>Sign</th>
                        <th className={Style.th} style={{ minWidth: "130px" }}>Long (DMS)</th>
                        <th className={Style.th} style={{ minWidth: "130px" }}>Aspects</th>
                    </tr>
                </thead>
                <tbody>{sortedArray(housesArray)}</tbody>
            </table>
        </div>

    );
};

type PlanetsTableProps = {
    planetsArray: planet[];
    aspects: aspect[];
};

export const PlanetsTable: React.FC<PlanetsTableProps> = ({ planetsArray, aspects }) => {
    type sortOptions =
        | "name"
        | "long"
        | "lat"
        | "speed"
        | "house"
        | "sign"
        | "aspect";

    const [sort, setSort] = useState<sortOptions>("long");

    const sortedArray = (planetsArray: planet[]) => {
        const output = planetsArray;
        return output
            .sort((a, b) => {

                if (a[sort] < b[sort]) return -1;
                if (a[sort] > b[sort]) return 1;
                return 0;
            })
            .map((planet, index) => (
                <tr className={Style.tr} key={index}>
                    <td className={Style.td} style={{ minWidth: "150px", maxWidth: "150px" }} title={planet.name}>{limitCharacters(planet.name)}</td>
                    <td className={Style.td}>{planet.position}</td>
                    <td className={Style.td}>{planet.sign}</td>
                    <td className={Style.td} style={{ minWidth: "130px" }}>{planet.longDegree}° {planet.longMinute}&lsquo; {planet.longSecond}&quot;</td>
                    <td className={Style.td}>{planet.lat}</td>
                    <td className={Style.td}>{planet.speed}</td>
                    <td className={Style.td}>{planet.house}</td>
                    <td className={Style.td}>{getAspectString(aspects, 'planet', planet.name)}</td>
                </tr>
            ));
    };

    const limitCharacters = (string: string) => {
        if (string.length >= 120) {
            return string.slice(120).concat('...')
        }

        return string
    }

    return (
        <div className={Style.tableContainer}>
            <table className={Style.table}>
                <thead>
                    <tr className={Style.thead}>
                        <th className={Style.th} style={{ minWidth: "150px", maxWidth: "150px" }} onClick={() => setSort("name")}>Planet</th>
                        <th className={Style.th} onClick={() => setSort("long")}>Long (decimal)</th>
                        <th className={Style.th} onClick={() => setSort("sign")}>Sign</th>
                        <th className={Style.th} style={{ minWidth: "130px" }}>Long (DMS)</th>
                        <th className={Style.th} onClick={() => setSort("lat")}>Latitude</th>
                        <th className={Style.th} onClick={() => setSort("speed")}>Speed</th>
                        <th className={Style.th} onClick={() => setSort("house")}>House</th>
                        <th className={Style.th} onClick={() => setSort("house")}>Aspects</th>
                    </tr>
                </thead>
                <tbody>{sortedArray(planetsArray)}</tbody>
            </table>
        </div>
    );
};

type FixedStarsTableProps = {
    starsArray: star[];
    aspects: aspect[];
};

export const FixedStarsTable: React.FC<FixedStarsTableProps> = ({ starsArray, aspects }) => {
    type sortOptions =
        | "aspect"
        | "star"
        | "constellation"
        | "position"
        | "lat"
        | "speed"
        | "house"
        | "distance"
        | "magnitude"
        | "sign";

    const [sort, setSort] = useState<sortOptions>("position");

    const sortedArray = (starsArray: star[]) => {
        const output = starsArray;
        return output
            .sort((a, b) => {

                if (a[sort] < b[sort]) return -1;
                if (a[sort] > b[sort]) return 1;
                return 0;
            })
            .map((star, index) => (
                <tr className={Style.tr} key={index}>
                    <td className={Style.td}>{getAspectString(aspects, 'star', star.name)}</td>
                    <td className={Style.td} style={{ minWidth: "150px", maxWidth: "150px" }} title={star.name}>{limitCharacters(star.name)}</td>
                    <td className={Style.td}>{star.constellation}</td>
                    <td className={Style.td}>{star.position}</td>
                    <td className={Style.td}>{star.sign}</td>
                    <td className={Style.td} style={{ minWidth: "130px" }}>{star.longDegree}° {star.longMinute}&lsquo; {star.longSecond}&quot;</td>
                    <td className={Style.td}>{star.house}</td>
                    <td className={Style.td}>{parseFloat(star.lat).toFixed(2)}</td>
                    <td className={Style.td}>{star.speed}</td>
                    <td className={Style.td}>{parseFloat(star.distance).toFixed(2)}</td>
                    <td className={Style.td}>{star.magnitude}</td>
                </tr>
            ));
    };

    const limitCharacters = (string: string) => {
        if (string.length >= 120) {
            return string.slice(120).concat('...')
        }

        return string
    }

    return (
        <div className={Style.tableContainer}>
            <table className={Style.table}>
                <thead>
                    <tr className={Style.thead}>
                        <th className={Style.th} style={{ minWidth: "130px" }}>Aspects</th>
                        <th className={Style.th} style={{ minWidth: "150px", maxWidth: "150px" }} onClick={() => setSort("star")}>Star</th>
                        <th className={Style.th} onClick={() => setSort("constellation")}>Alt Name</th>
                        <th className={Style.th} onClick={() => setSort("position")}>Long (decimal)</th>
                        <th className={Style.th} onClick={() => setSort("sign")}>Sign</th>
                        <th className={Style.th} style={{ minWidth: "130px" }}>Long (DMS)</th>
                        <th className={Style.th} onClick={() => setSort("house")}>House</th>
                        <th className={Style.th} onClick={() => setSort("lat")}>Latitude</th>
                        <th className={Style.th} onClick={() => setSort("speed")}>Speed</th>
                        <th className={Style.th} onClick={() => setSort("distance")}>Distance(LY)</th>
                        <th className={Style.th} onClick={() => setSort("magnitude")}>Magnitude</th>
                    </tr>
                </thead>
                <tbody>{sortedArray(starsArray)}</tbody>
            </table>
        </div>
    );
};



