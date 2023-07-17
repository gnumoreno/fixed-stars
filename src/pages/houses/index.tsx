import { type NextPage } from "next";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Style from "./Index.module.css";
import Head from "next/head";
import { type house } from "~/server/api/routers/houses";
import { Loading } from "~/components/utils/Loading";

const Testpage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Houses</title>
      </Head>
      <HousesForm></HousesForm>
    </div>
  );
};
export default Testpage;

const HousesForm: React.FC = () => {
  const testCommand = api.houses.getHouses.useMutation();

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("00:00");
  // const [location, setLocation] = useState<string>("");

  const [housesData, setHousesData] = useState<house[] | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(date);
    testCommand.mutate(
      { date: date, time: time },
      {
        onSuccess: (data) => {
          //   console.log(data);
          if (data.output) {
            setHousesData(data.output);
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
          housesData
            ?
            <HousesTable housesArray={housesData} />
            :
            <p>You haven&apos;t submit any data</p>
      }
    </div>
  );
};

type HousesTableProps = {
  housesArray: house[];
};

const HousesTable: React.FC<HousesTableProps> = ({ housesArray }) => {
  type sortOptions =
    | "name"
    | "long"
    | "lat"
    | "speed"
    // | "house"
    | "sign";

  const [sort, setSort] = useState<sortOptions>("long");

  const sortedArray = (housesArray: house[]) => {
    const output = housesArray;
    return output
      .sort((a, b) => {

        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
      })
      .map((house, index) => (
        <tr className={Style.tr} key={index}>
          <td className={Style.td} style={{ minWidth: "150px", maxWidth: "150px" }} title={house.name}>{limitCharacters(house.name)}</td>
          <td className={Style.td}>{house.position}</td>
          <td className={Style.td}>{house.sign}</td>
          <td className={Style.td} style={{ minWidth: "130px" }}>{house.longDegree}° {house.longMinute}&lsquo; {house.longSecond}&quot;</td>
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
            <th className={Style.th} style={{ minWidth: "150px", maxWidth: "150px" }} onClick={() => setSort("name")}>house</th>
            <th className={Style.th} onClick={() => setSort("long")}>Long (decimal)</th>
            <th className={Style.th} onClick={() => setSort("sign")}>Sign</th>
            <th className={Style.th} style={{ minWidth: "130px" }}>Long (DMS)</th>
          </tr>
        </thead>
        <tbody>{sortedArray(housesArray)}</tbody>
      </table>
    </div>
  );
};
// 