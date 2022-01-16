import { getCurrentCommunityProfile } from '../store/getters'
import supportedLanguages from '../supported_languages.json'
import supportedCountries from '../supportedCountries.json'

export const curateLanguageList = () => {
  const communityLangs = getCurrentCommunityProfile().lang_cds
  const curatedLanguageList = supportedLanguages.filter((language) => communityLangs.includes(language.lang))
  return curatedLanguageList
}

export const curateCountryList = () => {
  const countryData: supportedCountryData[] = supportedCountries.map((country) => {
    return { country_name: country.country_name, id: country.id, alpha_2: country.alpha_2 }
  })
  const japanData: supportedCountryData = countryData.filter((country) => country.country_name === "Japan")[0]

  // This is a start to generate the i18n file for countries
  // need to creat a new object out here and map through to provide keys and values
  // might just use for (country of supportedCountries)
  const test = supportedCountries.map((country) => {
    const test_1 = country.country_name
    const obj = `country_name_${test_1}: ${test_1}` 
    return obj
  })

  console.log("TEST", test)
  

  // ripped straight from MDN
  const sortFunction = (a: supportedCountryData, b: supportedCountryData) => {
    const nameA = a.country_name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.country_name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  const formattedCountryList = [japanData, ...countryData.sort(sortFunction)]
  return formattedCountryList
}
