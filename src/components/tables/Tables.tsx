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
        | "position"
        | "lat"
        | "speed"
        | "sign";

    const [sort, setSort] = useState<sortOptions>("position");
    const [reverse, setReverse] = useState<boolean>(false);
    const handleSort = (sortTo: sortOptions) => {
        if (sortTo === sort) {
            setReverse(!reverse)
            return;
        }
        setSort(sortTo);
    }
    const sortedArray = (housesArray: house[]) => {
        const output = housesArray;
        return output
            .sort((a, b) => {
                if (reverse) {
                    if (a[sort] < b[sort]) return 1;
                    if (a[sort] > b[sort]) return -1;
                    return 0;
                }
                if (a[sort] < b[sort]) return -1;
                if (a[sort] > b[sort]) return 1;
                return 0;
            })
            .map((house, index) => (
                <tr className={Style.tr} key={index}>
                    <td className={Style.td} title={house.name}>{limitCharacters(house.name)}</td>
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
                        <th className={Style.th} onClick={() => handleSort("name")}>house</th>
                        <th className={Style.th} onClick={() => handleSort("position")}>Long (decimal)</th>
                        <th className={Style.th} onClick={() => handleSort("sign")}>Sign</th>
                        <th className={Style.th} style={{ minWidth: "130px" }}>Long (DMS)</th>
                        <th className={Style.th} >Aspects</th>
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
        | "position"
        | "lat"
        | "speed"
        | "house"
        | "sign"
        | "aspect";

    const [sort, setSort] = useState<sortOptions>("position");
    const [reverse, setReverse] = useState<boolean>(false);
    const handleSort = (sortTo: sortOptions) => {
        if (sortTo === sort) {
            setReverse(!reverse)
            return;
        }
        setSort(sortTo);
    }

    const sortedArray = (planetsArray: planet[]) => {
        const output = planetsArray;
        return output
            .sort((a, b) => {
                if (reverse) {
                    if (a[sort] < b[sort]) return 1;
                    if (a[sort] > b[sort]) return -1;
                    return 0;
                }
                if (a[sort] < b[sort]) return -1;
                if (a[sort] > b[sort]) return 1;
                return 0;
            })
            .map((planet, index) => (
                <tr className={Style.tr} key={index}>
                    <td className={Style.td} title={planet.name}>{limitCharacters(planet.name)}</td>
                    <td className={Style.td + (planet.dom === planet.unicode ? ' ' + Style.blueText : '')}>{planet.dom}</td>
                    <td className={Style.td + (planet.exalt === planet.unicode ? ' ' + Style.blueText : '')}>{planet.exalt}</td>
                    <td className={Style.td + (planet.trip === planet.unicode ? ' ' + Style.blueText : '')}>{planet.trip}</td>
                    <td className={Style.td + (planet.term === planet.unicode ? ' ' + Style.blueText : '')}>{planet.term}</td>
                    <td className={Style.td + (planet.face === planet.unicode ? ' ' + Style.blueText : '')}>{planet.face}</td>
                    <td className={Style.td + (planet.detriment === planet.unicode ? ' ' + Style.redText : '')}>{planet.detriment}</td>
                    <td className={Style.td + (planet.fall === planet.unicode ? ' ' + Style.redText : '')}>{planet.fall}</td>
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
                        <th className={Style.th} style={{ minWidth: "150px", maxWidth: "150px" }} onClick={() => handleSort("name")}>Planet</th>
                        <th className={Style.th} onClick={() => "dom"}>Dom</th>
                        <th className={Style.th} onClick={() => "exalt"}>Ex</th>
                        <th className={Style.th} onClick={() => "trip"}>Trip</th>
                        <th className={Style.th} onClick={() => "term"}>Term</th>
                        <th className={Style.th} onClick={() => "face"}>Face</th>
                        <th className={Style.th} onClick={() => "detriment"}>Det</th>
                        <th className={Style.th} onClick={() => "fall"}>Fall</th>
                        <th className={Style.th} onClick={() => handleSort("position")}>Long (decimal)</th>
                        <th className={Style.th} onClick={() => handleSort("sign")}>Sign</th>
                        <th className={Style.th} style={{ minWidth: "130px" }}>Long (DMS)</th>
                        <th className={Style.th} onClick={() => handleSort("lat")}>Latitude</th>
                        <th className={Style.th} onClick={() => handleSort("speed")}>Speed</th>
                        <th className={Style.th} onClick={() => handleSort("house")}>House</th>
                        <th className={Style.th} onClick={() => handleSort("aspect")}>Aspects</th>
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
        | "name"
        | "constellation"
        | "position"
        | "lat"
        | "speed"
        | "house"
        | "distance"
        | "magnitude"
        | "sign";

    const [sort, setSort] = useState<sortOptions>("position");
    const [reverse, setReverse] = useState<boolean>(false);
    const handleSort = (sortTo: sortOptions) => {
        if (sortTo === sort) {
            setReverse(!reverse)
            return;
        }
        setSort(sortTo);
    }
    const sortedArray = (starsArray: star[]) => {
        const output = starsArray;
        return output
            .sort((a, b) => {
                if (reverse) {
                    if (a[sort] < b[sort]) return 1;
                    if (a[sort] > b[sort]) return -1;
                    return 0;
                }
                if (a[sort] < b[sort]) return -1;
                if (a[sort] > b[sort]) return 1;
                return 0;
            })
            .map((star, index) => (
                <tr className={Style.tr} key={index}>
                    <td className={Style.td}>{getAspectString(aspects, 'star', star.name)}</td>
                    <td className={Style.td} title={star.name}>{limitCharacters(star.name)}</td>
                    <td className={Style.td}>{star.constellation}</td>
                    <td className={Style.td}>{star.position}</td>
                    <td className={Style.td}>{star.sign}</td>
                    <td className={Style.td} style={{ minWidth: '130px' }}>{star.longDegree}° {star.longMinute}&lsquo; {star.longSecond}&quot;</td>
                    <td className={Style.td}>{star.house}</td>
                    <td className={Style.td}>{star.lat.toFixed(2)}</td>
                    <td className={Style.td}>{star.speed}</td>
                    <td className={Style.td}>{star.distance.toFixed(2)}</td>
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
                        <th className={Style.th} >Aspects</th>
                        <th className={Style.th} onClick={() => handleSort("name")}>Star</th>
                        <th className={Style.th} onClick={() => handleSort("constellation")}>Alt Name</th>
                        <th className={Style.th} onClick={() => handleSort("position")}>Long (decimal)</th>
                        <th className={Style.th} onClick={() => handleSort("sign")}>Sign</th>
                        <th className={Style.th} style={{ minWidth: '130px' }}>Long (DMS)</th>
                        <th className={Style.th} onClick={() => handleSort("house")}>House</th>
                        <th className={Style.th} onClick={() => handleSort("lat")}>Latitude</th>
                        <th className={Style.th} onClick={() => handleSort("speed")}>Speed</th>
                        <th className={Style.th} onClick={() => handleSort("distance")}>Distance(LY)</th>
                        <th className={Style.th} onClick={() => handleSort("magnitude")}>Magnitude</th>
                    </tr>
                </thead>
                <tbody>{sortedArray(starsArray)}</tbody>
            </table>
        </div>
    );
};



