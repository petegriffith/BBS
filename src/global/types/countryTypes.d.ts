

interface supportedCountry {
    id: number,
    country_name: string,
    alpha_2: supportedCountryAlpha,
    alpha_3: string,
    flag_url: string,
    created_at: string,
    updated_at: string
}

interface supportedCountryData {
    id: number,
    alpha_2: supportedCountryAlpha,
    country_name: string,
}


interface emmited_profile_data {
    nickname: string,
    selectedCountry: supportedCountryData 
}

// This needs to be updated to grab all possible supported countries
type supportedCountryAlpha = string