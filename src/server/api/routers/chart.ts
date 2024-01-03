import fs from "fs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getErrorMessage } from "~/utils/error";
import {  dmsToDec } from "~/utils/astroCalc";
import { getStarsData } from "~/utils/external/stars/stars";
import { getHousesData } from "~/utils/external/houses/houses";
import { getPlanetsData } from "~/utils/external/planets/planets";
import { getAspects, getAstroTable } from "~/utils/external/aspects/aspects";
import { getArabicPartArray } from "~/utils/external/arabicParts/arabic";
import { getCountries, queryCities } from "~/utils/cities/queries";
import {find} from 'geo-tz';
import { findTimezone } from "~/utils/scripts/timezone";
import { performance } from "perf_hooks";
import { getUnixTime } from "date-fns";
import sweph from "sweph";

// Make sure this is found in the server. Issue: https://github.com/vercel/next.js/discussions/14807
// The problem is that this function doesn't fail if the path is incorrect. The values in the chart
// still get calculated, but using the Moshier ephemeris instead of the Swiss Ephemeris, as described
// here: https://www.astro.com/swisseph/swephprg.htm#_Toc112948952
sweph.set_ephe_path(`${process.cwd()}/ephe`);

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
        houseSystem: z.enum(["P", "R"])
    })).mutation( ({ input }) => {

        try {
            // check if ephemeris folder exists and logs it
            console.log('Ephemeris folder exists: ', fs.existsSync(`${process.cwd()}/ephe`));

            const day = input.date.getDate();
            const month = input.date.getMonth() + 1;
            const year = input.date.getFullYear();
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
            const houseSystem = input.houseSystem;

            const [hours, minutes] = input.time.split(":");

            const hoursDec = parseInt(hours) + (parseInt(minutes) / 60);
            const julianDay = sweph.julday(year, month, day, hoursDec, sweph.constants.SE_GREG_CAL);

            const housesData = getHousesData(julianDay, latitude, longitude, alt, houseSystem);

            const ascendantPos = housesData[0].position || 0;
            const starsData = getStarsData(julianDay, housesData, ascendantPos);
            const planetsData = getPlanetsData(julianDay, housesData, ascendantPos)
            const arabicPartsData = getArabicPartArray(housesData, planetsData)
            const astroTable = getAstroTable(planetsData.slice(0,7), housesData, starsData, arabicPartsData)
            const aspectsData = getAspects(astroTable)

            


            return {
                status: 200,
                elements: {
                    houses: housesData,
                    stars: starsData,
                    planets: planetsData,
                    arabicParts: arabicPartsData,
                    aspects: aspectsData,
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

    getCountries: publicProcedure.input(z.object({
        queryString: z.string(),
    })).query(({ input }) => {
        const countriesResult = getCountries(input.queryString);
        return countriesResult.slice(0, 20);
    }),

    getCities: publicProcedure.input(z.object({
        queryString: z.string(),
        country: z.string(),
    })).query(({ input }) => {
        const citiesResult = queryCities(input.queryString, input.country);
        return citiesResult.slice(0, 20);
    }),

    getTimezone: publicProcedure.input(z.object({
        long: z.number(),
        lat: z.number(),
        countryCode: z.string(),
        date: z.date(),
        time: z.string(), // hh:mm 
    })).query(({ input }) => {
        // console.log('Received Date: ', input.date)
        const myDate = input.date;
        myDate.setHours(0, 0, 0, 0);
        const fnsUnix = getUnixTime(myDate);
        // console.log('fnsUnix:', new Date(fnsUnix * 1000))
        const UnixWithoutOffset = fnsUnix - (myDate.getTimezoneOffset() * 60);
        // console.log('UnixWithoutOffset:', new Date(UnixWithoutOffset * 1000))
       
        const timezoneName = find(input.lat, input.long)[0];
        const timeInSeconds = timeStringToSeconds(input.time);
        // console.log('Time in Seconds: ', timeInSeconds)
        const unixDate = UnixWithoutOffset + timeInSeconds;
        // console.log('Unix Date: ', new Date(unixDate * 1000))

        const TzPerf = performance.now();
        const adjustedTimeZone = findTimezone(input.countryCode, timezoneName, unixDate);
        // console.log('Adjusted Timezone: ', adjustedTimeZone)
        const TzPerfEnd = performance.now();
        const AdjustedUnixDate = unixDate + (adjustedTimeZone.gmt_offset * -1);
        // console.log('Adjusted Unix Date: ', new Date(AdjustedUnixDate * 1000))
        const UTCDate = new Date(AdjustedUnixDate * 1000);
        // console.log(UTCDate.toISOString())

        return {
            timeZone: {
                abv: adjustedTimeZone.abbreviation,
                gmt_offset: (adjustedTimeZone.gmt_offset / 3600),
                utc: UTCDate,
            },
            BinarySearchPerf: `BinarySearch: ${(TzPerfEnd - TzPerf).toFixed(4)}ms`,
        };
    })

});

const timeStringToSeconds = (timeString: string) => {
    const timeArray = timeString.split(":");
    const hours = parseInt(timeArray[0]);
    const minutes = parseInt(timeArray[1]);

    const hoursToMs = hours * 60 * 60;
    const minutesToMs = minutes * 60;

    return hoursToMs + minutesToMs
}