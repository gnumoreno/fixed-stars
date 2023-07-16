import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { spawn, exec, spawnSync, execSync } from "child_process";
import { decToDMS } from "~/utils/astroCalc";

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
    })
  )
  .mutation(({ input }) => {
    console.log(input.date);
    const day = input.date.getDate();
    const month = input.date.getMonth() + 1;
    const year = input.date.getFullYear();
    const formatedDate = `${day}.${month}.${year}`;
    // console.log("Date: ", formatedDate);

    // Hardcoded values until we have a way to fetch geoposition (using Curitiba) and time input. Also using Placidus in all calculations for now.
    const formatedTime = "10:15"
    const long = -49.27305556
    const lat = -25.42777778
    const alt = 935
    const houseSystem = "P"

    // Not sure this is needed but I have a feeling it will be.
    // const planets = [
    //   "Sun",
    //   "Moon",
    //   "Mercury",
    //   "Venus",
    //   "Mars",
    //   "Jupiter",
    //   "Saturn",
    //   "Uranus",
    //   "Neptune",
    //   "Pluto",
    //   "true Node",
    // ];

    const command = `swetest -b${formatedDate} -utc${formatedTime} -p0123456789m -fPlbs  -hsy${houseSystem} -geopos${long},${lat},${alt} -g, -head`;
    console.log("Command: ", command);

    const getPlanetsOutput = execSync(command, {
      encoding: "utf-8",
    });

    console.log("OutputFromCommand", getPlanetsOutput);
    const swePlanetsOutput = getPlanetsOutput.split(/\r?\n/);
    const empty = swePlanetsOutput.pop();
    // console.log("justATest", empty)
    // console.log("SplitFromCommand: ", swePlanetsOutput);
    // console.log("SizeOfCommand: ", swePlanetsOutput.length);

    try {
      const myPlanets = [] as planet[];
      
      for (const line of swePlanetsOutput) {
        const each = line.split(",");
        const long = parseFloat(each[1]!);
        const tmp = decToDMS(long);
        const result = {
          name: each[0],
          position: long,
          sign: tmp.sign,
          longDegree: tmp.signDegree,
          longMinute: tmp.signMinute,
          longSecond: tmp.signSecond,
          lat: parseFloat(each[2]!),
          speed: parseFloat(each[3!]),
        } as planet;
        myPlanets.push(result);
      }
      // console.log(myPlanets);
      return {
        output: myPlanets,
      };
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
  lat: number;
  speed: number;
};