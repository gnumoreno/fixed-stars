export type astro = {
    astrotype: string,
    astroname: string,
    position: number,
    angle: number,
    orb: number
};

export type aspectProperty = {
    type: string,
    angle: number,
    unicode: string,
};

export type aspect = {
    astrotypeA: string,
    astronameA: string,
    positionA: number, // we will call position the position in the ecliptic
    angleA: number, // we will call angle the angle in the map drawing
    typeOfAspect: string,
    astrotypeB: string,
    astronameB: string,
    positionB: number, // we will call position the position in the ecliptic
    angleB: number, // we will call angle the angle in the map drawing
};

export type aspectedTo = {
    aspect: string,
    astrotype: string,
    astroname: string,
    position: number,
    angle: number,
}

export type aspectDetails = {
    astroA: {
        name: string;
        angle: number;
        aspectType: string;
        aspectedAstro: string;
    };
    astroB: {
        name: string;
        angle: number;
        aspectType: string;
        aspectedAstro: string;
    };
};