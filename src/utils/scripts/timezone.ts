import rawTimezone from '../../../public/timezones/sortedTimezones.json';

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


export const findTimezone = (countryCode: string, zoneName: string, timeStart: number) => {
    const countryTimezones = binarySearchByCountryCode(timezones, countryCode);
    const [firstIdx, lastIdx] = findSameTimezoneAfterBinarySearch(timezones, countryTimezones);
    const zoneTimezones = binarySearchByZoneName(timezones, zoneName, firstIdx, lastIdx);
    const [zoneFirstIdx, zoneLastIdx] = findSameTimezoneAfterZoneBinarySearch(timezones, zoneTimezones);
    const timeStartIdx = binarySearchByTimeStart(timezones, timeStart, zoneFirstIdx, zoneLastIdx);

    return timezones[timeStartIdx];

}

const binarySearchByCountryCode = (timezones: timezoneType[], countryCode: string) => {
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

const findSameTimezoneAfterBinarySearch = (timezones: timezoneType[], idx: number) => {
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

const binarySearchByZoneName = (timezones: timezoneType[], zoneName: string, startIdx: number, finalIdx: number) => {
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

const findSameTimezoneAfterZoneBinarySearch = (timezones: timezoneType[], idx: number) => {
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

const binarySearchByTimeStart = (timezones: timezoneType[], startTime: number, startIdx: number, finalIdx: number) => {
    let low = startIdx;
    let high = finalIdx;
    do {
        const mid = Math.floor(low + ((high - low) / 2));
        const midTimeStart = timezones[mid].time_start;
        // log low mid and high
        if (mid === finalIdx) {
            return mid;
        }
        if (
            midTimeStart === startTime ||
            (midTimeStart < startTime && timezones[mid + 1].time_start > startTime)
        ) {
            return mid;
        } if ((midTimeStart < startTime && timezones[mid + 1].time_start < startTime) && (mid + 2 > high)) {
            return mid + 1;

        } else if (midTimeStart > startTime) {
            high = mid;
        } else {
            low = mid + 1;
        }
    } while (low < high);
    return -1;
}