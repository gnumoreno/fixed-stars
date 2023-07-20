import { type NextPage } from "next";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Style from "./Index.module.css";
import Head from "next/head";
import { type majorStar } from "~/server/api/routers/stars";
import { type house } from "~/server/api/routers/houses";
import { type planet } from "~/server/api/routers/planets";
import { FixedStarsTable } from "./stars";
import { PlanetsTable } from "./planets";
import { HousesTable } from "./houses";
import { Loading } from "~/components/utils/Loading";
import { ChartSVG } from "~/components/astroChart/DrawChart";

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
  const [starsData, setStarsData] = useState<majorStar[] | null>(null);
  const [inputType, setInputType] = useState<"decimal" | "dms">("decimal");
  const [decimalValues, setDecimalValues] = useState<{ long: number | undefined; lat: number | undefined }>({ long: undefined, lat: undefined });
  const [longitude, setLongitude] = useState<{ degrees: number; minutes: number; seconds: number }>({ degrees: 0, minutes: 0, seconds: 0 });
  const [latitude, setLatitude] = useState<{ degrees: number; minutes: number; seconds: number }>({ degrees: 0, minutes: 0, seconds: 0 });



  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    testCommand.mutate(
      {
        date: date,
        time: time,
        long: decimalValues.long || 0,
        lat: decimalValues.lat || 0,
        dmsLong: {
          degrees: longitude.degrees,
          minutes: longitude.minutes,
          seconds: longitude.seconds,
        },
        dmsLat: {
          degrees: latitude.degrees,
          minutes: latitude.minutes,
          seconds: latitude.seconds,
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
          }

        },
      }
    );
    return;
  }
  const handleLongitudeDecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const longitudeValue = parseFloat(e.currentTarget.value);
    setDecimalValues((prevValues) => ({ ...prevValues, long: isNaN(longitudeValue) ? undefined : longitudeValue }));
  };

  const handleLatitudeDecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const latitudeValue = parseFloat(e.currentTarget.value);
    setDecimalValues((prevValues) => ({ ...prevValues, lat: isNaN(latitudeValue) ? undefined : latitudeValue }));
  };

  const handleLongitudeDegreesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const degreesValue = parseFloat(e.currentTarget.value);
    setLongitude((prevValues) => ({ ...prevValues, degrees: isNaN(degreesValue) ? 0 : degreesValue }));
  };

  const handleLongitudeMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutesValue = parseFloat(e.currentTarget.value);
    setLongitude((prevValues) => ({ ...prevValues, minutes: isNaN(minutesValue) ? 0 : minutesValue }));
  };

  const handleLongitudeSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const secondsValue = parseFloat(e.currentTarget.value);
    setLongitude((prevValues) => ({ ...prevValues, seconds: isNaN(secondsValue) ? 0 : secondsValue }));
  };

  const handleLatitudeDegreesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const degreesValue = parseFloat(e.currentTarget.value);
    setLatitude((prevValues) => ({ ...prevValues, degrees: isNaN(degreesValue) ? 0 : degreesValue }));
  };

  const handleLatitudeMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutesValue = parseFloat(e.currentTarget.value);
    setLatitude((prevValues) => ({ ...prevValues, minutes: isNaN(minutesValue) ? 0 : minutesValue }));
  };

  const handleLatitudeSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const secondsValue = parseFloat(e.currentTarget.value);
    setLatitude((prevValues) => ({ ...prevValues, seconds: isNaN(secondsValue) ? 0 : secondsValue }));
  };

  const handleInputTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputType = e.target.value as "decimal" | "dms";
    setInputType(inputType);

    if (inputType === "decimal") {
      setLongitude({ degrees: 0, minutes: 0, seconds: 0 });
      setLatitude({ degrees: 0, minutes: 0, seconds: 0 });
    } else {
      setDecimalValues({ long: undefined, lat: undefined });
    }
  };



  const [selectedCalc, setSelectedCalc] = useState<"houses" | "planets" | "stars">("houses");


  return (
    <div className={Style.pageContainer}>
      <div className={Style.formContainer}>
        <form onSubmit={(e) => { handleFormSubmit(e) }} className={Style.form}>
          <h1 className={Style.title}>Houses</h1>
          <label htmlFor="date">Date:</label>
          <input
            name="date"
            type="date"
            value={date.toLocaleDateString("en-ca")}
            onChange={(e) => {
              const changeDate = new Date(e.currentTarget.value)
              changeDate.setHours(changeDate.getHours() + 3)
              // console.log(changeDate.toLocaleString('en-ca'))
              setDate(changeDate)
            }}
          />
          <label htmlFor="time">Time:</label>
          <input
            name="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.currentTarget.value)}
          />
          <label htmlFor="longitude">Longitude:</label>
          {inputType === "decimal" ? (
            <input
              name="longitude"
              type="number"
              step="any"
              value={decimalValues.long ?? ""}
              min={-180}
              max={180}
              onChange={handleLongitudeDecChange}
            />
          ) : (
            <div>
              <input
                name="degrees"
                type="number"
                value={longitude.degrees}
                min={-180}
                max={180}
                onChange={handleLongitudeDegreesChange}
                placeholder="°"
                style={{ width: "50px" }}
              />
              <input
                name="minutes"
                type="number"
                value={longitude.minutes}
                min={0}
                max={59}
                onChange={handleLongitudeMinutesChange}
                placeholder="'"
                style={{ width: "50px" }}
              />
              <input
                name="seconds"
                type="number"
                value={longitude.seconds}
                min={0}
                max={59}
                onChange={handleLongitudeSecondsChange}
                placeholder='"'
                style={{ width: "50px" }}
              />
            </div>
          )}
          <label htmlFor="latitude">Latitude:</label>
          {inputType === "decimal" ? (
            <input
              name="latitude"
              type="number"
              step="any"
              value={decimalValues.lat ?? ""}
              min={-90}
              max={90}
              onChange={handleLatitudeDecChange}
            />
          ) : (
            <div>
              <input
                name="degrees"
                type="number"
                value={latitude.degrees}
                min={-90}
                max={90}
                onChange={handleLatitudeDegreesChange}
                placeholder="°"
                style={{ width: "50px" }}
              />
              <input
                name="minutes"
                type="number"
                value={latitude.minutes}
                min={0}
                max={59}
                onChange={handleLatitudeMinutesChange}
                placeholder="'"
                style={{ width: "50px" }}
              />
              <input
                name="seconds"
                type="number"
                value={latitude.seconds}
                min={0}
                max={59}
                onChange={handleLatitudeSecondsChange}
                placeholder='"'
                style={{ width: "50px" }}
              />
            </div>
          )}
          <div>
            <label>
              <input
                type="radio"
                name="inputType"
                value="decimal"
                checked={inputType === "decimal"}
                onChange={handleInputTypeChange}
              />
              Decimal
            </label>
            <label>
              <input
                type="radio"
                name="inputType"
                value="dms"
                checked={inputType === "dms"}
                onChange={handleInputTypeChange}
              />
              Degrees, Minutes, Seconds (DMS)
            </label>
          </div>
          <button type="submit">Calculate</button>
          {
            !testCommand.data && <p>You haven&apos;t submit any data</p>
          }
        </form>
        {testCommand.data && <ChartSVG
          housesData={housesData}
          planetsData={planetsData}
          starsData={starsData}
        />}


      </div>

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
          testCommand.isLoading
            ?
            <Loading />
            :
            selectedCalc === "houses" && housesData
              ?
              <HousesTable housesArray={housesData} />
              :
              selectedCalc === "planets" && planetsData
                ?
                <PlanetsTable planetsArray={planetsData} />
                :
                selectedCalc === "stars" && starsData
                  ?
                  <FixedStarsTable starsArray={starsData} />
                  :
                  null
        }

      </div>

    </div>
  )
}