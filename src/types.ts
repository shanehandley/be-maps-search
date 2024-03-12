/**
 * A subset of parameters for the `Fuzzy Search` operation
 *
 * @see https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search#request-data
 */
export interface SearchRequest {
    params: {
        key: string
        /**
         * Maximum number of search results that will be returned. Defaults to 30
         */
        limit: number
        /**
         * If the "typeahead" flag is set, the query will be interpreted as a partial input and the search will enter <b>predictive</b> mode.
         */
        typeahead: boolean
    }
}

interface LatLon {
    lat: number
    lon: number
}

export interface SearchResponseItemAddress {
    streetName: string
    streetNumber?: string | null
    municipality: string
    countrySecondarySubdivision: string
    countrySubdivision: string
    countrySubdivisionName: string
    countrySubdivisionCode: string
    countryCode: string
    country: string
    countryCodeISO3: string
    freeformAddress: string
    localName: string
}

/**
 * A subset of the API response for the `Fuzzy Search` operation
 * 
 * @see https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search#response-data
 */
export interface SearchResponse {
    summary: {
        query: string
        queryType: string
        queryTime: number
        numResults: number
        offset: number
        totalResults: number
        fuzzyLevel: number
        queryIntent: string[]
    },
    results: {
        type: string
        id: string
        score: number
        address: SearchResponseItemAddress,
        position: LatLon
        viewport: {
            topLeftPoint: LatLon
            btmRightPoint: LatLon
        }
    }[],
}

/**
 * @see https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search#error-response
 */
export interface SearchError {
    errorText: string
    detailedError: {
        code: "BadRequest",
        message: string
        target?: string
    },
    httpStatusCode: number
}
