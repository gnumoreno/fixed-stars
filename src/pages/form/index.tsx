import { NextPage } from "next";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Style from "./Index.module.css";
import Head from "next/head";
import { majorStar } from "~/server/api/routers/stars";

const Testpage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Fixed Stars</title>
      </Head>
      <ChartForm></ChartForm>
    </div>
  );
};
export default Testpage;

const ChartForm: React.FC = () => {
  const testCommand = api.stars.getStars.useMutation();

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("00:00");
  const [location, setLocation] = useState<string>("");

  const [fixedStarsData, setFixedStarsData] = useState<majorStar[] | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(date);
    testCommand.mutateAsync(
      { date: date },
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
  };

  return (
    <div className={Style.page}>
      <form onSubmit={handleFormSubmit} className={Style.form}>
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
        {/* <label htmlFor="time">Time:</label>
        <input
          name="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.currentTarget.value)}
        />
        <label htmlFor="location">Location:</label>
        <input
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.currentTarget.value)}
        /> */}
        <button type="submit">Calculate</button>
      </form>

      {fixedStarsData ? (
        <FixedStarsTable starsArray={fixedStarsData} />
      ) : (
        <p>Você não enviou os dados do mapa</p>
      )}
    </div>
  );
};

type FixedStarsTableProps = {
  starsArray: majorStar[];
};

const FixedStarsTable: React.FC<FixedStarsTableProps> = ({ starsArray }) => {
  type sortOptions =
    | "star"
    | "constellation"
    | "long"
    | "lat"
    | "speed"
    | "house"
    | "distance"
    | "magnitude"
    | "sign";

  const [sort, setSort] = useState<sortOptions>("long");

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
          <td className={Style.td} title={star.star}>{limitCharacters(star.star)}</td>
          <td className={Style.td}>{star.constellation}</td>
          <td className={Style.td}>{star.long}</td>
          <td className={Style.td}>{star.sign}</td>
          <td className={Style.td}>{star.longDegree}</td>
          <td className={Style.td}>{star.longMinute}</td>
          <td className={Style.td}>{star.longSecond}</td>
          <td className={Style.td}>{star.lat}</td>
          <td className={Style.td}>{star.speed}</td>
          <td className={Style.td}>{star.house}</td>
          <td className={Style.td}>{star.distance}</td>
          <td className={Style.td}>{star.magnitude}</td>
        </tr>
      ));
  };

  const limitCharacters = (string:string) => {
    if(string.length >= 120) {
        return string.slice(120).concat('...')
    }

    return string
  }

  return (
    <div className={Style.tableContainer}>
      <table className={Style.table}>
        <thead>
          <tr className={Style.thead}>
            <th className={Style.th} onClick={() =>setSort("star")}>Star</th>
            <th className={Style.th} onClick={() =>setSort("constellation")}>Alt Name</th>
            <th className={Style.th} onClick={() =>setSort("long")}>Long (decimal)</th>
            <th className={Style.th} onClick={() =>setSort("sign")}>Sign</th>
            <th className={Style.th}>Deg</th>
            <th className={Style.th}>Min</th>
            <th className={Style.th}>Sec</th>
            <th className={Style.th} onClick={() =>setSort("lat")}>Latitude</th>
            <th className={Style.th} onClick={() =>setSort("speed")}>Speed</th>
            <th className={Style.th} onClick={() =>setSort("house")}>House</th>
            <th className={Style.th} onClick={() =>setSort("distance")}>Distance</th>
            <th className={Style.th} onClick={() =>setSort("magnitude")}>Magnitude</th>
          </tr>
        </thead>
        <tbody>{sortedArray(starsArray)}</tbody>
      </table>
    </div>
  );
};
