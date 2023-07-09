import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { spawn, exec, spawnSync, execSync } from "child_process";
import { decToDMS } from "~/utils/astroCalc";

export const starsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getStars: publicProcedure
    .input(
      z.object({
        date: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      const home = "/Users/morenogarciaesilva/";
      // console.log(input.date);
      const day = input.date.getDate();
      const month = input.date.getMonth() + 1;
      const year = input.date.getFullYear();
      const formatedDate = `${day}.${month}.${year}`;
      // console.log("Data: ", formatedDate);

      const majorStars = [
        "Menkar",
        "BatenKaitos",
        "DenebKaitos",
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

      try {
        const fixedStars = [] as majorStar[];

        for (const star of majorStars) {
          const command = `/Users/morenogarciaesilva/swisseph/swetest -b${formatedDate} -pf -fPlbsjR= -xf${star} -head -g,`;
          // console.log("comando:", command);

          const getStarOutput = execSync(command, {
            encoding: "utf-8",
          });
          let myData = getStarOutput.split(",");
          const long = parseFloat(myData[2]!);
          // console.log("getStarOutput");
          // console.log(getStarOutput);
          const tmp = decToDMS(long);
          const result = {
            star: myData[0],
            constellation: myData[1],
            long: long,
            sign: tmp.sign,
            longDegree: tmp.signDegree,
            longMinute: tmp.signMinute,
            longSecond: tmp.signSecond,
            lat: parseFloat(myData[3]!),
            speed: parseFloat(myData[4]!),
            house: Math.floor(parseFloat(myData[5]!)),
            distance: Number(parseFloat(myData[6]!).toFixed(2)),
            magnitude: parseFloat(myData[7]!.replace("m", "")),
          } as majorStar;
          fixedStars.push(result);
        }

        // console.log('rodei')

        // console.log('nao crashei')
        // console.log(fixedStars);
        return {
          output: fixedStars,
        };
      } catch (error) {
        console.log(error);
        return {
          error: error,
        };
      }
    }),
});

export type majorStar = {
  star: string;
  constellation: string;
  long: number;
  sign: string;
  longDegree: number;
  longMinute: number;
  longSecond: number;
  lat: number;
  speed: number;
  house: number;
  distance: number;
  magnitude: number;
};
