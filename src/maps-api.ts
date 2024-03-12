import axios, { AxiosResponse } from 'axios'
import { SearchRequest, SearchResponse } from './maps-api.types'

interface AutoCompleteOptions {
    limit: number
}

const defaultRequestOptions: AutoCompleteOptions = {
    limit: 30
}

/**
 * @see https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search
 * 
 * https://api.tomtom.com/search/2/search/Charlotte%20Street.json?typeahead=true&limit=100&countrySet=AUS&minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&relatedPois=off&key=*****
 */
export const getPlaceAutocomplete = async (
    address: string,
    options: AutoCompleteOptions = defaultRequestOptions
) => {
    if (!process.env.TOMTOM_API_KEY?.length) {
        throw new Error('MISSING_API_KEY')
    }

    const autocomplete = await axios.get<
        SearchRequest,
        AxiosResponse<SearchResponse>
    >(`https://api.tomtom.com/search/2/search/${address}.json`, {
        params: {
            typeahead: true,
            key: process.env.TOMTOM_API_KEY,
            limit: 30,
            countrySet: 'AUS'
        }
    })

    return autocomplete.data.results
}
