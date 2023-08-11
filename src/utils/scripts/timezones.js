
const { performance } = require('perf_hooks');
const rawTimezone = require('../../../public/timezones/sortedTimezones.json');

const fs = require('fs');

// {
//     "zone_name": "Africa/Abidjan",
//     "country_code": "CI",
//     "abbreviation": "LMT",
//     "time_start": -1830383033,
//     "gmt_offset": -968,
//     "dst": 0
//   }





// First, let's sort the timezones by country code

/**
 * @param {Array.<{
*  zone_name: string,
* country_code: string,
* abbreviation: string,
* time_start: number, gmt_offset: number,
* dst: number
* }>} timezones
* 
*/
// const sortTimezones = (timezones) => {
//     const sortedTimezones = timezones.sort((a, b) => {
//         if (a.country_code === b.country_code) {
//             if(a.zone_name === b.zone_name) {
//                 return a.time_start > b.time_start ? 1 : -1;
//             }
//             return a.zone_name > b.zone_name ? 1 : -1;
//         }
//         return a.country_code > b.country_code ? 1 : -1;
//     });
//     return sortedTimezones;
// };

// Now, lets save to a file


// const sortAndSaveTimezones = (timezones) => {
//     const sortedTimezones = sortTimezones(timezones);
//     const sortedTimezonesString = JSON.stringify(sortedTimezones);
//     fs.writeFileSync('public/timezones/sortedTimezones.json', sortedTimezonesString);
// }

// sortAndSaveTimezones(rawTimezone);

// Now, we will do a binary search by country code and return the array with the same country code
// then we will do a binary search by zone name and return the array with the same zone name
// then we will do a binary search by time start and find the first greater than or equal to the time start
/**
 * @param {Array.<{
*  zone_name: string,
* country_code: string,
* abbreviation: string,
* time_start: number, gmt_offset: number,
* dst: number
* }>} timezones
* @param {string} countryCode
* @param {string} zoneName
* @param {number} timeStart
*/
const findTimezone = (timezones, countryCode, zoneName, timeStart) => {
    const t0 = performance.now();
    const countryTimezones = binarySearchByCountryCode(timezones, countryCode);
    const [firstIdx, lastIdx] = findSameTimezoneAfterBinarySearch(timezones, countryTimezones);
    const zoneTimezones = binarySearchByZoneName(timezones, zoneName, firstIdx, lastIdx);
    const [zoneFirstIdx, zoneLastIdx] = findSameTimezoneAfterZoneBinarySearch(timezones, zoneTimezones);
    const timeStartIdx = binarySearchByTimeStart(timezones, timeStart, zoneFirstIdx, zoneLastIdx);

    const t1 = performance.now();
    console.log(`Call to findTimezone took ${t1 - t0}ms.`);
    return timezones[timeStartIdx];
   
}

const binarySearchByCountryCode = (timezones, countryCode) => {
    let low = 0;
    let high = timezones.length;
    do {
        const mid = Math.floor(low + ((high - low) / 2));
        const midCountryCode = timezones[mid].country_code;
        
        if (midCountryCode === countryCode) {
            return mid;
        } else if (midCountryCode > countryCode) {
            high = mid;
        } else {
            low = mid + 1;
        }

    } while (low < high);  
    return -1;
}

const findSameTimezoneAfterBinarySearch = (timezones, idx) => {
    let lastIdx = idx;
    let lastFound = false;
    let firstIdx = idx;
    let firstFound = false;
    const countryCode = timezones[idx].country_code;
    
    do {
        if (lastFound === false) {
            lastIdx++;
            if (timezones[lastIdx].country_code !== countryCode) {
                lastFound = true;
                lastIdx--;
            }
        }
        if (firstFound === false) {
            firstIdx--;
            if (timezones[firstIdx].country_code !== countryCode) {
                firstFound = true;
                firstIdx++;
            }
        }
    } while (!lastFound || !firstFound);
    return [firstIdx, lastIdx];
}

const binarySearchByZoneName = (timezones, zoneName, startIdx, finalIdx) => {
    let low = startIdx;
    let high = finalIdx;
    do {
        const mid = Math.floor(low + ((high - low) / 2));
        const midZoneName = timezones[mid].zone_name;
        if (midZoneName === zoneName) {
            return mid;
        } else if (midZoneName > zoneName) {
            high = mid;
        } else {
            low = mid + 1;
        }
    } while (low < high);
    return -1;
}

const findSameTimezoneAfterZoneBinarySearch = (timezones, idx) => {
    let lastIdx = idx;
    let lastFound = false;
    let firstIdx = idx;
    let firstFound = false;
    const zoneName = timezones[idx].zone_name;
    
    do {
        if (lastFound === false) {
            lastIdx++;
            if (timezones[lastIdx].zone_name !== zoneName) {
                lastFound = true;
                lastIdx--;
            }
        }
        if (firstFound === false) {
            firstIdx--;
            if (timezones[firstIdx].zone_name !== zoneName) {
                firstFound = true;
                firstIdx++;
            }
        }
    } while (!lastFound || !firstFound);
    return [firstIdx, lastIdx];
}

const binarySearchByTimeStart = (timezones, startTime, startIdx, finalIdx) => {
    let low = startIdx;
    let high = finalIdx;
    do {
        const mid = Math.floor(low + ((high - low) / 2));
        const midTimeStart = timezones[mid].time_start;
        if(mid === finalIdx) {
            return mid;
        }
        if (midTimeStart === startTime || (midTimeStart > startTime && timezones[mid - 1].time_start < startTime)) {
            return mid - 1;
        } else if (midTimeStart > startTime) {
            high = mid;
        } else {
            low = mid + 1;
        }
    } while (low < high);
    return -1;
}



const findTimeZoneWithLinearSearch = (timezones, countryCode, zoneName, timeStart) => {
   const  t0 = performance.now();
    let idx = 0;
    for (let i = 0; i < timezones.length; i++) {
        if(i === timezones.length - 1) {
            idx = i;
            break;
        }
        if (timezones[i].country_code === countryCode && timezones[i].zone_name === zoneName && (timezones[i].time_start <= timeStart && timezones[i + 1].time_start > timeStart)) {
            idx = i;
            break;
        }
    }
    // console.log(timezones[idx], idx);

    const t1 = performance.now();
    console.log(`Call to findTimeZoneWithLinearSearch took ${t1 - t0}ms.`);
    return null;
}

// findTimeZoneWithLinearSearch(rawTimezone, 'ZA', 'Africa/Johannesburg', -829526400);
findTimezone(rawTimezone, 'ZA', 'Africa/Johannesburg', -829526400);
// findTimezone(rawTimezone, 'AD', 'Europe/Andorra', -2077453165);
