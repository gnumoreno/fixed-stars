import { type NextPage } from "next";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Style from "./Index.module.css";
import Head from "next/head";
import { type house } from "~/server/api/routers/houses";
import { Loading } from "~/components/utils/Loading";
import { number } from "prop-types";

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
          if (data.output) {
            setHousesData(data.output);
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