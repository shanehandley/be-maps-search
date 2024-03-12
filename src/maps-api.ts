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
 */
export const getPlaceAutocomplete = async (
    address: string,
    options: AutoCompleteOptions = defaultRequestOptions
) => {
    if (!process.env.TOMTOM_API_KEY?.length) {
        throw new Error('MISSING_API_KEY')
    }

    if (!address.trim().length) {
        throw new Error('INVALID_QUERY')
    }

    const params = {
        typeahead: true,
        key: process.env.TOMTOM_API_KEY,
        countrySet: 'AUS',
        ...options
    }

    try {
        const autocomplete = await axios.get<
            SearchRequest,
            AxiosResponse<SearchResponse>
        >(`https://api.tomtom.com/search/2/search/${address}.json`, {
            params
        })

        return autocomplete.data.results
    } catch (error) {
        return []
    }
}
