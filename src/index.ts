import { getPlaceAutocomplete } from './maps-api'

export async function getAutoCompleteDetails(address: string): Promise<any> {
    // get autocomplete results
    const res = await getPlaceAutocomplete(address).then((autocompleteResults) => {
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
