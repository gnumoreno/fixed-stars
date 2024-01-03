export type PlanetProperties = {
    name: string;
    unicode: string;
    temperature: string;
    humidity: string;
    element: string;
    swephCode: number;
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
    latitude: number;
    longitude: number;
    dailySpeed: number;
};

export type terms = {
    planet: string;
    degree: number;
};

export type planetBase = {
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
    dom: string;
    exalt: string;
    trip: string;
    term: string;
    face: string;
    detriment: string;
    fall: string;
};