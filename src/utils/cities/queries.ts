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

export const getCountries = (queryString:string) => {
    const countries = citiesJson.map((city) => city.country);
    const countriesSet = [...new Set(countries)];
    return countriesSet.filter((country) => {
        return country.toLowerCase().includes(queryString.toLowerCase());
    });
  };

export const queryCities = (queryString: string, country: string) => {
    const query = queryString.toLowerCase();

    const resultCities = citiesJson.filter(city => {
        return city.city_ascii.includes(query) && city.country === country;
    }).sort((a, b) => {
        return a.city_ascii > b.city_ascii ? 1 : -1;
    });

    return resultCities;
};