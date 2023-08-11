export type PlanetProperties = {
    name: string;
    unicode: string;
    temperature: string;
    humidity: string;
    element: string;
};

export type PlanetData = {
    name: string;
    unicode: string;
    temperature: string;
    humidity: string;
    element: string;
};

export type planetAPI = {
    name: string;
    latitude: string;
    longitude: string;
    dailySpeed: string;
};

export type terms = {
    planet: string;
    degree: number;
};

export type planet = {
    name: string;
    position: number;
    angle: number;
    orb: number;
    sign: string;
    longDegree: number;
    longMinute: number;
    longSecond: number;
    house: number;
    lat: number;
    speed: number;
    unicode: string;
    temperature: string;
    humidity: string;
    element: string;
};