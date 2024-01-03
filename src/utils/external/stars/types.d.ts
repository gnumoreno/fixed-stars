export type starAPI = {
    starName: string;
    longitude: number;
    latitude: number;
    house: string;
    distance: number;
    speed: number;
    magnitude: number;
    altName: string;
}

export type star = {
    name: string;
    constellation: string;
    position: number;
    angle: number;
    sign: string;
    longDegree: number;
    longMinute: number;
    longSecond: number;
    lat: number;
    speed: number;
    house: number;
    distance: number;
    magnitude: number;
    orb: number;
    nature: string;
    url: string;
  }

export type StarProperties = {
    name: string;
    orb: number;
    nature: string;
    url: string;
}