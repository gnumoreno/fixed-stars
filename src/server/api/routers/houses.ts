import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { spawn, exec, spawnSync, execSync } from "child_process";
import { decToDMS } from "~/utils/astroCalc";
import { GO_API_ENDPOINT } from "./stars";

export const housesRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getHouses: publicProcedure
    .input(
      z.object({
        date: z.date(),
        time: z.string(),
      })
    )
    .mutation(async ({ input }) => {


      try {
        console.log(input.date);
        const day = input.date.getDate();
        const month = input.date.getMonth() + 1;
        const year = input.date.getFullYear();
        const formatedDate = `${day}.${month}.${year}`;
        // console.log("Date: ", formatedDate);
        console.log(input.time)
        // Hardcoded values until we have a way to fetch geoposition (using Curitiba) and time input. Also using Placidus in all calculations for now.
        const formatedTime = input.time
        const long = -49.27305556
        const lat = -25.42777778
        const alt = 935
        const houseSystem = "P"
        // http://18.231.181.140:8000/run-houses?birthdate=1.12.1986&utctime=10:15&latitude=-25.42777778&longitude=-49.27305556&altitude=935&housesystem=P

        const queryURL = `${GO_API_ENDPOINT}/run-houses?birthdate=${formatedDate}&utctime=${formatedTime}&latitude=${lat}&longitude=${long}&altitude=${alt}&housesystem=${houseSystem}`
        console
        const housesArrayResponse = await fetch(queryURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        const housesArray = await housesArrayResponse.json() as houseAPI[]


      // Not sure this is needed but I have a feeling it will be.
      //   const houses = [
      //     "house  1"
      //     "house  2"
      //     "house  3"
      //     "house  4"
      //     "house  5"
      //     "house  6"
      //     "house  7"
      //     "house  8"
      //     "house  9"
      //     "house 10"
      //     "house 11"
      //     "house 12"
      //     "Ascendant"
      //     "MC"
      //     "ARMC"
      //     "Vertex"
      //     "equat. Asc."
      //     "co-Asc. W.Koch"
      //     "co-Asc Munkasey"
      //     "Polar Asc."
      // ];


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

        return {
          output: myhouses
        }


      } catch (error) {
        console.log(error);
        return {
          error: "Error",
        };
      }
    }),
});

export type house = {
  name: string;
  position: number;
  sign: string;
  longDegree: number;
  longMinute: number;
  longSecond: number;
};

export type houseAPI = {
  name: string;
  longitude: string;
}