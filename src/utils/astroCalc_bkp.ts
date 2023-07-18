const Signs = [
  { sign: "Aries", angle: 0 },
  { sign: "Taurus", angle: 30 },
  { sign: "Gemini", angle: 60 },
  { sign: "Cancer", angle: 90 },
  { sign: "Leo", angle: 120 },
  { sign: "Virgo", angle: 150 },
  { sign: "Libra", angle: 180 },
  { sign: "Scorpio", angle: 210 },
  { sign: "Sagittarius", angle: 240 },
  { sign: "Capricorn", angle: 270 },
  { sign: "Aquarius", angle: 300 },
  { sign: "Pisces", angle: 330 },
];

// const aspectType = [
//   { name: "conjunction", angle: 0, unicode: "u260C" },
//   { name: "sextile", angle: 60, unicode: "u26B9" },
//   { name: "square", angle: 90, unicode: "u25A1" },
//   { name: "trine", angle: 120, unicode: "u25B3" },
//   { name: "oposition", angle: 180, unicode: "u260D" },
// ];

export const signOver = (dec: number) => {
  const cycle = dec % 360;
  return cycle;
};
export const signFromDec = (long: number) => {
  let mySign = { sign: "Pisces", angle: 330 };
  let stop = false;
  Signs.forEach((sign, idx) => {
    if (signOver(long) < sign.angle && stop === false) {
      mySign = Signs[idx - 1]!;
      stop = true;
    }
  });
  return mySign;
};

export const decToDMS = (long: number) => {
  const mySign = signFromDec(long);
  const signDegree = long - mySign.angle;
  const signMinute = (signDegree - Math.floor(signDegree)) * 60;
  const signSecond = (signMinute - Math.floor(signMinute)) * 60;
  return {
    ...mySign,
    signDegree: Math.floor(signDegree),
    signMinute: Math.floor(signMinute),
    signSecond: parseFloat(signSecond.toFixed(2)),
  };
};

export const antiscia = (long: number) => {
  return ( 90 - (long - 90 ) ) % 360 ;
}

export const contraantiscia = (antiscia: number) => {
  return ( antiscia + 180) % 360 ;
}