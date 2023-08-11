import rawTimezone from '../../../public/timezones/sortedTimezones.json';
import fs from 'fs';

// {
//     "zone_name": "Africa/Abidjan",
//     "country_code": "CI",
//     "abbreviation": "LMT",
//     "time_start": -1830383033,
//     "gmt_offset": -968,
//     "dst": 0
//   }

type timezoneType = {
    zone_name: string;
    country_code: string;
    abbreviation: string;
    time_start: number;
    gmt_offset: number;
    dst: number;
};

const timezones = rawTimezone as timezoneType[];


// First, let's sort the timezones by country code


const sortTimezones = (timezones: timezoneType[]) => {
    const sortedTimezones = timezones.sort((a, b) => {
        return a.country_code > b.country_code ? 1 : -1;
    });
    return sortedTimezones;
};

// Now, lets save to a file


const sortAndSaveTimezones = (timezones: timezoneType[]) => {
    const sortedTimezones = sortTimezones(timezones);
    const sortedTimezonesString = JSON.stringify(sortedTimezones);
    fs.writeFileSync('spublic/timezones/sortedTimezones.json', sortedTimezonesString);
}

sortAndSaveTimezones(timezones);