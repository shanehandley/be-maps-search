import axios, { AxiosResponse } from 'axios'
import { SearchRequest, SearchResponse } from './types'

interface SearchOptions {
    limit?: number
}

const defaultSearchOptions: SearchOptions = {
    limit: 10,
}

export async function getAutoCompleteDetails(
    address: string,
    options: SearchOptions = defaultSearchOptions
): Promise<any> {
    // get autocomplete results
    const res = await getPlaceAutocomplete(address, options)
        .then((autocompleteResults) => {
            // loop over and get details and map results
            return autocompleteResults.map(({ id: placeId, address }) => {
                const {
                    streetNumber = null,
                    countryCode,
                    country,
                    freeformAddress,
                    municipality
                } = address

                return {
                    placeId,
                    streetNumber,
                    countryCode,
                    country,
                    freeformAddress,
                    municipality
                }
            })
        })

    return res
}

const getPlaceAutocomplete = async (
    address: string,
    options: SearchOptions
) => {
    if (!process.env.TOMTOM_API_KEY?.length) {
        throw new Error('MISSING_API_KEY')
    }

    if (!address.trim().length) {
        throw new Error('INVALID_QUERY')
    }

    if (options.limit && (isNaN(options.limit) || options.limit < 1)) {
        throw new Error('INVALID_LIMIT')
    }

    const params = {
        typeahead: true,
        key: process.env.TOMTOM_API_KEY,
        countrySet: 'AUS',
        limit: options.limit || 10
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
