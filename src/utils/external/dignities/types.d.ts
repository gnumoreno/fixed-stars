export type Sign = {
    sign: string;
    unicode: string;
    angle: number;
    domicile: string;
    exaltation: string;
    triplicity_day: string;
    triplicity_night: string;
    detriment: string;
    fall: string;
    terms: [string, number][];
    faces: string[];
  };

export type Dignities = {
    sign: string;
    domicile: string;
    exaltation: string;
    detriment: string;
    fall: string;
    triplicity: string;
    term: string;
    face: string;
  };
