import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getErrorMessage } from "~/utils/error";
import { type majorStar, type majorStarResponse } from "./stars";
import { decToDMS, dmsToDec, houseFromDec } from "~/utils/astroCalc";
import { type planet, type planetAPI } from "./planets";
import { type house, type houseAPI } from "./houses";
export const GO_API_ENDPOINT = "http://18.231.181.140:8000"
export const chartRouter = createTRPCRouter({

    getChartData: publicProcedure.input(z.object({
        date: z.date(),
        time: z.string(),
        long: z.number(),
        lat: z.number(),
        dmsLong: z.object({
            degrees: z.number(),
            minutes: z.number(),
            seconds: z.number(),
        }),
        dmsLat: z.object({
            degrees: z.number(),
            minutes: z.number(),
            seconds: z.number(),
        }),
        inputType: z.enum(["decimal", "dms"]),
    })).mutation(async ({ input }) => {

        try {

            const day = input.date.getDate();
            const month = input.date.getMonth() + 1;
            const year = input.date.getFullYear();
            const formatedDate = `${day}.${month}.${year}`;

            const formatedTime = input.time;
            let longitude: number;
            let latitude: number;

            if (input.inputType === "decimal") {
                longitude = input.long;
                latitude = input.lat;
            } else if (input.inputType === "dms") {
                longitude = dmsToDec(input.dmsLong.degrees, input.dmsLong.minutes, input.dmsLong.seconds);
                latitude = dmsToDec(input.dmsLat.degrees, input.dmsLat.minutes, input.dmsLat.seconds);
            } else {
                // Raise an error however the fuck we do this here
            }
            const alt = 0
            const houseSystem = "P"

            // houses
            console.log('Start houses')
            const housesURL = `${GO_API_ENDPOINT}/run-houses?birthdate=${formatedDate}&utctime=${formatedTime}&latitude=${latitude}&longitude=${longitude}&altitude=${alt}&housesystem=${houseSystem}`
            // console.log(housesURL)
            const housesArrayResponse = await fetch(housesURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const housesArray = await housesArrayResponse.json() as houseAPI[]

            const myhouses = housesArray.map((house) => {
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


            // get Stars
            console.log('Start stars')


            const starsURL = `${GO_API_ENDPOINT}/run-star?birthdate=${formatedDate}&utctime=${input.time}&stars=${majorStars.join(',')}`
            console.log('starsURL', starsURL)

            const starsArrayResponse = await fetch(starsURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const starsArray = await starsArrayResponse.json() as majorStarResponse[];

            const starsOutput = starsArray.map(star => {
                const tmp = decToDMS(parseFloat(star.longitude));
                // const long = parseFloat(star.longitude);
                const longitude = parseFloat(star.longitude);
                console.log('req houses', myhouses.length);
                console.log('req longitude', longitude);
                const starHouse = houseFromDec(myhouses, longitude);
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
            // end Stars


            // get Planets
            console.log('Start planets')

            const planetsURL = `${GO_API_ENDPOINT}/run-planets?birthdate=${formatedDate}&utctime=${formatedTime}&latitude=${latitude}&longitude=${longitude}&altitude=${alt}&housesystem=${houseSystem}`

            const planetsArrayResponse = await fetch(planetsURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const planetsArray = await planetsArrayResponse.json() as planetAPI[]

            const myPlanets = planetsArray.map((planet) => {
                const long = parseFloat(planet.longitude);
                const tmp = decToDMS(long);
                console.log(myhouses.length)
                const house = houseFromDec(myhouses, long)
                const result = {
                    name: planet.name,
                    position: long,
                    sign: tmp.sign,
                    longDegree: tmp.signDegree,
                    longMinute: tmp.signMinute,
                    longSecond: tmp.signSecond,
                    house: house,
                    lat: parseFloat(planet.latitude),
                    speed: parseFloat(planet.dailySpeed),
                } as planet;
                return result
            })
            console.log('end planets')
            // end Planets



            return {
                status: 200,
                elements: {
                    houses: myhouses,
                    stars: starsOutput,
                    planets: myPlanets,
                },
                error: undefined as undefined
            }




        } catch (error) {
            return {
                status: 500,
                elements: undefined as undefined,
                error: getErrorMessage(error)
            }
        }









    }),



});

const majorStars = [
    "Menkar",
    "BatenKaitos",
    "DenebKaitos",
    "Difda",
    "Scheat",
    "Markab",
    "Algenib",
    "Enif",
    "Hamal",
    "Sheratan",
    "Aldebaran",
    "ElNath",
    "AlHecka",
    "Alcyone",
    "Pollux",
    "Castor",
    "Sirius",
    "Procyon",
    "Praesepe",
    "AsellusAustralis",
    "AsellusBorealis",
    "Betelgeuse",
    "Bellatrix",
    "Rigel",
    "Saiph",
    "Alpheratz",
    "Almach",
    "Mirach",
    "Algol",
    "Mirfak",
    "Capella",
    "Menkalinan",
    "Regulus",
    "Denebola",
    "Zosma",
    "Spica",
    "Vindemiatrix",
    "Algorab",
    "Unukalhai",
    "Toliman",
    "Agena",
    "Zubenelgenubi",
    "Zubeneshamali",
    "Antares",
    "Shaula",
    "Aculeus",
    "Acumen",
    "Alphard",
    "Rasalgethi",
    "Ascella",
    "Facies",
    "Nunki",
    "Vega",
];