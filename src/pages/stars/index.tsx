import { type NextPage } from "next";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Style from "./Index.module.css";
import Head from "next/head";
import { type majorStar } from "~/server/api/routers/stars";
import { Loading } from "~/components/utils/Loading";

const Testpage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Fixed Stars</title>
      </Head>
      <StarsTable></StarsTable>
    </div>
  );
};
export default Testpage;

const StarsTable: React.FC = () => {
  const testCommand = api.stars.newGetStars.useMutation();

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("00:00");
  // const [location, setLocation] = useState<string>("");

  const [fixedStarsData, setFixedStarsData] = useState<majorStar[] | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(date);
    testCommand.mutate(
      { date: date, time: time },
      {
        onSuccess: (data) => {
          //   console.log(data);
          if (data.output) {
            setFixedStarsData(data.output);
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
        <h1 className={Style.title}>Fixed Stars</h1>
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
          fixedStarsData
            ?
            <FixedStarsTable starsArray={fixedStarsData} />
            :

            <p>You haven&apos;t submit any data</p>
      }
    </div>
  );
};

export type FixedStarsTableProps = {
  starsArray: majorStar[];
};

export const FixedStarsTable: React.FC<FixedStarsTableProps> = ({ starsArray }) => {
  type sortOptions =
    | "star"
    | "constellation"
    | "position"
    | "lat"
    | "speed"
    | "house"
    | "distance"
    | "magnitude"
    | "sign";

  const [sort, setSort] = useState<sortOptions>("position");

  const sortedArray = (starsArray: majorStar[]) => {
    const output = starsArray;
    return output
      .sort((a, b) => {

        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
      })
      .map((star, index) => (
        <tr className={Style.tr} key={index}>
          <td className={Style.td} style={{ minWidth: "150px", maxWidth: "150px" }} title={star.star}>{limitCharacters(star.star)}</td>
          <td className={Style.td}>{star.constellation}</td>
          <td className={Style.td}>{star.position}</td>
          <td className={Style.td}>{star.sign}</td>
          <td className={Style.td} style={{ minWidth: "130px" }}>{star.longDegree}° {star.longMinute}&lsquo; {star.longSecond}&quot;</td>
          <td className={Style.td}>{star.house}</td>
          <td className={Style.td}>{star.lat}</td>
          <td className={Style.td}>{star.speed}</td>
          <td className={Style.td}>{star.distance}</td>
          <td className={Style.td}>{star.magnitude}</td>
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
            <th className={Style.th} style={{ minWidth: "150px", maxWidth: "150px" }} onClick={() => setSort("star")}>Star</th>
            <th className={Style.th} onClick={() => setSort("constellation")}>Alt Name</th>
            <th className={Style.th} onClick={() => setSort("position")}>Long (decimal)</th>
            <th className={Style.th} onClick={() => setSort("sign")}>Sign</th>
            <th className={Style.th} style={{ minWidth: "130px" }}>Long (DMS)</th>
            <th className={Style.th} onClick={() => setSort("house")}>House</th>
            <th className={Style.th} onClick={() => setSort("lat")}>Latitude</th>
            <th className={Style.th} onClick={() => setSort("speed")}>Speed</th>
            <th className={Style.th} onClick={() => setSort("distance")}>Distance</th>
            <th className={Style.th} onClick={() => setSort("magnitude")}>Magnitude</th>
          </tr>
        </thead>
        <tbody>{sortedArray(starsArray)}</tbody>
      </table>
    </div>
  );
};
// 