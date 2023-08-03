import { type NextPage } from "next";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Style from "./Index.module.css";
import Head from "next/head";
import { Loading } from "~/components/utils/Loading";
import { ChartSVG } from "~/components/astroChart/DrawChart";
import { CoordinatesSelection, DateSelection, TimeSelection } from "~/components/input/CustomInputs";
import type { house } from "~/utils/external/houses/types";
import type { planet } from "~/utils/external/planets/types";
import type{ star } from "~/utils/external/stars/types";
import { FixedStarsTable, HousesTable, PlanetsTable } from "~/components/tables/Tables";
import { type aspect } from "~/utils/external/aspects/types";
import { type arabicPart } from "~/utils/external/arabicParts/types";


const Testpage: NextPage = () => {
  return (
    <div className={Style.pageContainer2}>
      <Head>
        <title>Fixed Stars</title>
      </Head>
      <NavButtons></NavButtons>
    </div>
  );
};
export default Testpage;


const NavButtons: React.FC = () => {
  const testCommand = api.chart.getChartData.useMutation();

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("00:00");
  // const [location, setLocation] = useState<string>("");

  const [housesData, setHousesData] = useState<house[] | null>(null);
  const [planetsData, setPlanetsData] = useState<planet[] | null>(null);
  const [starsData, setStarsData] = useState<star[] | null>(null);
  const [aspectsData, setAspectsData] = useState<aspect[] | null>(null);
  const [arabicPartsData, setArabicPartsData] = useState<arabicPart[] | null>(null);
  const [inputType, setInputType] = useState<"decimal" | "dms">("dms");
  const [decimalValues, setDecimalValues] = useState<{ long: string; lat: string }>({ long: "0", lat: "0" });
  const [longitude, setLongitude] = useState<{ degrees: string; minutes: string; seconds: string }>({ degrees: "0", minutes: "0", seconds: "0" });
  const [latitude, setLatitude] = useState<{ degrees: string; minutes: string; seconds: string }>({ degrees: "0", minutes: "0", seconds: "0" });



  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    testCommand.mutate(
      {
        date: date,
        time: time,
        long: Number(decimalValues.long),
        lat: Number(decimalValues.lat),
        dmsLong: {
          degrees: Number(longitude.degrees),
          minutes: Number(longitude.minutes),
          seconds: Number(longitude.seconds),
        },
        dmsLat: {
          degrees: Number(latitude.degrees),
          minutes: Number(latitude.minutes),
          seconds: Number(latitude.seconds),
        },
        inputType: inputType,
      },
      {
        onSuccess: (data) => {
          // console.log(data.output);
          if (data.elements) {
            setHousesData(data.elements.houses);
            setPlanetsData(data.elements.planets);
            setStarsData(data.elements.stars);
            setAspectsData(data.elements.aspects);
            setArabicPartsData(data.elements.arabicParts);
          }

        },
      }
    );
    return;
  }


  const [selectedCalc, setSelectedCalc] = useState<"houses" | "planets" | "stars">("houses");
  const timeSelectionRef = React.useRef<HTMLInputElement>(null);
  const coordinatesSelectionRef = React.useRef<HTMLInputElement>(null);


  return (
    <div className={Style.pageContainer}>
      <div className={Style.formContainer}>
        <form onSubmit={(e) => { handleFormSubmit(e) }} className={Style.form}>
          <h1 className={Style.title} onClick={() => console.log(time, longitude)}>BirthData</h1>
          <div className={Style.logoDivider}></div>
          <label htmlFor="date">Date:</label>
          <DateSelection
            date={date}
            setDate={setDate}
            nextInputRef={timeSelectionRef}
          />
          <label htmlFor="time">Time (UTC):</label>
          <TimeSelection
            time={time}
            setTime={setTime}
            nextInputRef={coordinatesSelectionRef}
            startRef={timeSelectionRef}
          />
          <CoordinatesSelection

            decimalCord={decimalValues}
            setDecimalCord={setDecimalValues}
            latitude={latitude}
            setLatitude={setLatitude}
            longitude={longitude}
            setLongitude={setLongitude}
            setInputType={setInputType}
            startRef={coordinatesSelectionRef}
          />
          {
            testCommand.isLoading
              ?
              <div className={Style.loadingContainer}>
                <Loading width={30} />
              </div>
              :
              <button type="submit" className={Style.submitButton}>Calculate</button>
          }
            </form>

      </div>
          {
            !testCommand.data && !testCommand.isLoading && <p className={Style.noData}>You haven&apos;t submit any data</p>
          }
        {testCommand.data && <ChartSVG
          housesData={housesData}
          planetsData={planetsData}
          starsData={starsData}
          arabicPartsData={arabicPartsData}
          aspectsData={aspectsData}
        />}

      <div className={Style.buttonsContainer}>

        <button
          onClick={() => { setSelectedCalc("houses") }}
          className={Style.button}>
          Houses
        </button>

        <button
          onClick={() => { setSelectedCalc("planets") }}
          className={Style.button}>
          Planets
        </button>

        <button
          // onClick={() => { setSelectedCalc("antarab") }}
          className={Style.button}>
          Antiscia & Arab Parts
        </button>

        <button
          onClick={() => { setSelectedCalc("stars") }}
          className={Style.button}>
          Fixed Stars
        </button>

      </div>

      <div className={Style.tablesContainer}>
        {/* {selectedCalc === "houses" && housesData && <HousesTable housesArray={housesData} />}
        {selectedCalc === "planets" && planetsData && <PlanetsTable planetsArray={planetsData} />}
        {selectedCalc === "stars" && starsData && <FixedStarsTable starsArray={starsData} />} */}

        {
          selectedCalc === "houses" && housesData
            ?
            <HousesTable housesArray={housesData} aspects={aspectsData} />
            :
            selectedCalc === "planets" && planetsData
              ?
              <PlanetsTable planetsArray={planetsData} aspects={aspectsData}/>
              :
              selectedCalc === "stars" && starsData
                ?
                <FixedStarsTable starsArray={starsData} aspects={aspectsData}/>
                :
                null
        }

      </div>

    </div>
  )
}

