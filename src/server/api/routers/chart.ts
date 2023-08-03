import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getErrorMessage } from "~/utils/error";
import { dmsToDec } from "~/utils/astroCalc";
import { getStarsData } from "~/utils/external/stars/stars";
import { getHousesData } from "~/utils/external/houses/houses";
import { getPlanetsData } from "~/utils/external/planets/planets";
import { getAspects, getAstroTable } from "~/utils/external/aspects/aspects";
import { getArabicPartArray } from "~/utils/external/arabicParts/arabic";
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

            const housesData = await getHousesData(formatedDate, formatedTime, latitude, longitude, alt, houseSystem)
            const ascendantPos = housesData[0].position || 0;
            const starsData = await getStarsData(formatedDate, formatedTime, housesData, ascendantPos);
            const planetsData = await getPlanetsData(formatedDate, formatedTime, latitude, longitude, alt, houseSystem, housesData, ascendantPos)
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
                    aspects: aspectsData
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
