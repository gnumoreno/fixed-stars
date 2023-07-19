import { type NextPage } from "next";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Style from "./Index.module.css";
import Head from "next/head";
import { type planet } from "~/server/api/routers/planets";
import { Loading } from "~/components/utils/Loading";

const Testpage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Planets</title>
      </Head>
      <PlanetsForm></PlanetsForm>
    </div>
  );
};
export default Testpage;

const PlanetsForm: React.FC = () => {
  const testCommand = api.planets.getPlanets.useMutation();

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("00:00");
  // const [location, setLocation] = useState<string>("");

  const [planetsData, setplanetsData] = useState<planet[] | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(date);
    testCommand.mutate(
      { date: date, time: time },
      {
        onSuccess: (data) => {
          //   console.log(data);
          if (data.output) {
            setplanetsData(data.output);
          }
        },
      }
    );
    // console.log("submit:", { date: date, time: time, location: location });

    return;
  }

  return (
    <div className={Style.page}>
      <form onSubmit={(e) => { handleFormSubmit(e) }} className={Style.form}>
        <h1 className={Style.title}>Planets</h1>
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
        {/* <label htmlFor="location">Location:</label>
        <input
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.currentTarget.value)}
        /> */}
        <button type="submit">Calculate</button>
      </form>

      {
        testCommand.isLoading
          ?
          <Loading />
          :
          planetsData
            ?
            <PlanetsTable planetsArray={planetsData} />
            :
            <p>You haven&apos;t submit any data</p>
      }
    </div>
  );
};

export type PlanetsTableProps = {
  planetsArray: planet[];
};

export const PlanetsTable: React.FC<PlanetsTableProps> = ({ planetsArray }) => {
  type sortOptions =
    | "name"
    | "long"
    | "lat"
    | "speed"
    | "house"
    | "sign";

  const [sort, setSort] = useState<sortOptions>("long");

  const sortedArray = (planetsArray: planet[]) => {
    const output = planetsArray;
    return output
      .sort((a, b) => {

        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
      })
      .map((planet, index) => (
        <tr className={Style.tr} key={index}>
          <td className={Style.td} style={{ minWidth: "150px", maxWidth: "150px" }} title={planet.name}>{limitCharacters(planet.name)}</td>
          <td className={Style.td}>{planet.position}</td>
          <td className={Style.td}>{planet.sign}</td>
          <td className={Style.td} style={{ minWidth: "130px" }}>{planet.longDegree}° {planet.longMinute}&lsquo; {planet.longSecond}&quot;</td>
          <td className={Style.td}>{planet.lat}</td>
          <td className={Style.td}>{planet.speed}</td>
          <td className={Style.td}>{planet.house}</td>
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
            <th className={Style.th} style={{ minWidth: "150px", maxWidth: "150px" }} onClick={() => setSort("name")}>Planet</th>
            <th className={Style.th} onClick={() => setSort("long")}>Long (decimal)</th>
            <th className={Style.th} onClick={() => setSort("sign")}>Sign</th>
            <th className={Style.th} style={{ minWidth: "130px" }}>Long (DMS)</th>
            <th className={Style.th} onClick={() => setSort("lat")}>Latitude</th>
            <th className={Style.th} onClick={() => setSort("speed")}>Speed</th>
            <th className={Style.th} onClick={() => setSort("house")}>House</th>
          </tr>
        </thead>
        <tbody>{sortedArray(planetsArray)}</tbody>
      </table>
    </div>
  );
};
// 