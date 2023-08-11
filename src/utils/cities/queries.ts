import cities from '../../../public/cities/cities.json'

export type CityData = {
    city: string;
    city_ascii: string;
    lat: number;
    lng: number;
    country: string;
    iso2: string;
    iso3: string;
    admin_name: string;
    capital: string;
    population: number;
    id: number;
};

const citiesJson = cities as CityData[];

export const getCountries = (queryString: string) => {
    const countries = citiesJson.map((city) => city.country);
    const countriesSet = [...new Set(countries)];
    const query = queryString.toLowerCase();
    return countriesSet.filter((country) => {
        return country.toLowerCase().includes(query);
    }).sort((a, b) => {
        const biggestLength = a.length > b.length ? a.length : b.length;
        for (let i = 0; i < biggestLength; i++) {
            const querySubstring = query.substring(0, i + 1);
            if (i + 1 > query.length) {
                if (a.toLocaleLowerCase()[i] === b.toLocaleLowerCase()[i]) {
                    continue;
                }
                return a.toLocaleLowerCase()[i] || 'a' > b.toLocaleLowerCase()[i] || 'a' ? 1 : -1;
            }
            if (a.toLocaleLowerCase().startsWith(querySubstring) && b.toLocaleLowerCase().startsWith(querySubstring)) {
                continue;
            }
            if (!a.toLocaleLowerCase().startsWith(querySubstring) && !b.toLocaleLowerCase().startsWith(querySubstring)) {
                if (a[i] === b[i]) {
                    continue;
                }
                return a[i] > b[i] ? 1 : -1;
            }
            if (a.toLocaleLowerCase().startsWith(querySubstring) && !b.toLocaleLowerCase().startsWith(querySubstring)) {
                return -1;
            } else if (!a.toLocaleLowerCase().startsWith(querySubstring) && b.toLocaleLowerCase().startsWith(querySubstring)) {
                return 1;
            }
        }
        return 0;
    });
};

export const queryCities = (queryString: string, country: string) => {
    const query = queryString.toLowerCase();

    const resultCities = citiesJson.filter(city => {
        return city.city_ascii.includes(query) && city.country === country;
    }).sort((a, b) => {
        const biggestLength = a.city_ascii.length > b.city_ascii.length ? a.city_ascii.length : b.city_ascii.length;
        for (let i = 0; i < biggestLength; i++) {
            const querySubstring = query.substring(0, i + 1);
            if (i + 1 > query.length) {
                if (a.city_ascii[i] === b.city_ascii[i]) {
                    continue;
                }
                return a.city_ascii[i] || 'a' > b.city_ascii[i] || 'a' ? 1 : -1;
            }
            if (a.city_ascii.startsWith(querySubstring) && b.city_ascii.startsWith(querySubstring)) {
                continue;
            }
            if (!a.city_ascii.startsWith(querySubstring) && !b.city_ascii.startsWith(querySubstring)) {
                if (a.city_ascii[i] === b.city_ascii[i]) {
                    continue;
                }
                return a.city_ascii[i] > b.city_ascii[i] ? 1 : -1;
            }
            if (a.city_ascii.startsWith(querySubstring) && !b.city_ascii.startsWith(querySubstring)) {
                return -1;
            } else if (!a.city_ascii.startsWith(querySubstring) && b.city_ascii.startsWith(querySubstring)) {
                return 1;
            }
        }
        return 0;
    });

    return resultCities;
};