import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { spawn, exec, spawnSync, execSync } from "child_process";
import { decToDMS } from "~/utils/astroCalc";
import { GO_API_ENDPOINT } from "./stars";

export const planets: PlanetProperties[] = [
  { name: "Sun", unicode: '\u2609', temperature: "hot", humidity: "dry", element: "fire" },
  { name: "Moon", unicode: '\u263E', temperature: "cold", humidity: "wet", element: "water" },
  { name: "Mercury", unicode: '\u263F', temperature: "cold", humidity: "dry", element: "earth" },
  { name: "Venus", unicode: '\u2640', temperature: "cold", humidity: "wet", element: "water" },
  { name: "Mars", unicode: '\u2641', temperature: "hot", humidity: "dry", element: "fire" },
  { name: "Jupiter", unicode: '\u2643', temperature: "hot", humidity: "wet", element: "air" },
  { name: "Saturn", unicode: '\u2644', temperature: "cold", humidity: "dry", element: "earth" },
  { name: "Uranus", unicode: '\u2645', temperature: "", humidity: "", element: "" },
  { name: "Neptune", unicode: '\u2646', temperature: "", humidity: "", element: "" },
  { name: "Pluto", unicode: '\u2647', temperature: "", humidity: "", element: "" },
  { name: "true Node", unicode: '\u260A', temperature: "", humidity: "", element: "" },
];

export const planetsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getPlanets: publicProcedure
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
        // http://18.231.181.140:8000/run-planets?birthdate=1.12.1986&utctime=10:15&latitude=-25.42777778&longitude=-49.27305556&altitude=935&housesystem=P

        const queryURL = `${GO_API_ENDPOINT}/run-planets?birthdate=${formatedDate}&utctime=${formatedTime}&latitude=${lat}&longitude=${long}&altitude=${alt}&housesystem=${houseSystem}`

        const planetsArrayResponse = await fetch(queryURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        const planetsArray = await planetsArrayResponse.json() as planetAPI[]
      
        const myPlanets = planetsArray.map((planet) => {
          const long = parseFloat(planet.longitude);
          const tmp = decToDMS(long);
          const result = {
            name: planet.name,
            position: long,
            sign: tmp.sign,
            longDegree: tmp.signDegree,
            longMinute: tmp.signMinute,
            longSecond: tmp.signSecond,
            lat: parseFloat(planet.latitude),
            speed: parseFloat(planet.dailySpeed),
          } as planet;
          return result
        })

        return {
          output: myPlanets
        }


      } catch (error) {
        console.log(error);
        return {
          error: "Error",
        };
      }
    }),
});

export type planet = {
  name: string;
  position: number;
  sign: string;
  longDegree: number;
  longMinute: number;
  longSecond: number;
  house: string;
  lat: number;
  speed: number;
  unicode: string;
  temperature: string;
  humidity: string;
  element: string;
};

// planets.ts

export type PlanetProperties = {
  name: string;
  unicode: string;
  temperature: string;
  humidity: string;
  element: string;
};

export interface PlanetData {
  name: string;
  unicode: string;
  temperature: string;
  humidity: string;
  element: string;
}

export type planetAPI = {
  name: string;
  latitude: string;
  longitude: string;
  dailySpeed: string;
}