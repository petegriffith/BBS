import { getCurrentCommunityProfile } from '../store/getters'
import supportedLanguages from '../supported_languages.json'
import supportedCountries from '../supportedCountries.json'

export const curateLanguageList = () => {
  const communityLangs = getCurrentCommunityProfile().lang_cds
  const curatedLanguageList = supportedLanguages.filter((language) => communityLangs.includes(language.lang))
  return curatedLanguageList
}

export const curateCountryList = () => {
  const test: supportedCountryData[] = supportedCountries.map((country) => {
    return { country_name: country.country_name, id: country.id, alpha_2: country.alpha_2 }
  })
  const japanData: supportedCountryData = test.filter((country) => country.country_name === "Japan")[0]

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

  const formattedCountryList = [japanData, ...test.sort(sortFunction)]
  return formattedCountryList
}
