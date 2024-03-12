import { config } from 'dotenv'
import { describe } from '@jest/globals'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { getPlaceAutocomplete } from '../src/maps-api'
import { getAutoCompleteDetails } from '../src'

// These are end-to-end tests and need an api key
describe('Tomtom Places E2E Tests', () => {
  describe('getPlaceAutocomplete - Invalid environment', () => {
    beforeAll(async () => {
      config({
        // This file does not need to exist, as long as the TOMTOM_API_KEY is not found
        path: '.env.test'
      })
    })

    it('throws when the TOMTOM_API_KEY is unset', async () => {
      expect(getPlaceAutocomplete('Charlotte Street')).rejects.toThrow('MISSING_API_KEY')
    })
  })

  describe('getAutoCompleteDetails', () => {
    beforeAll(() => {
      config()
    })

    it('returns a promise', () => {
      const res = getAutoCompleteDetails('Charlotte Street')
      expect(res).toBeInstanceOf(Promise)
    })

    it('can fetch from the autocomplete api', async () => {
      const res = await getAutoCompleteDetails('Charlotte Street')
      const firstRes = res[0];
      expect(firstRes).toHaveProperty('placeId')
      expect(firstRes).toHaveProperty('streetNumber')
      expect(firstRes).toHaveProperty('countryCode')
      expect(firstRes).toHaveProperty('country')
      expect(firstRes).toHaveProperty('freeformAddress')
      expect(firstRes).toHaveProperty('municipality')
    })
  })

  describe('getPlaceAutocomplete', () => {
    beforeAll(() => {
      config()
    })

    it('throws when an empty address is provided', async () => {
      expect(getPlaceAutocomplete('')).rejects.toThrow('INVALID_QUERY')
    })

    it('throws when an address consisting entirely of whitespace is provided', async () => {
      expect(getPlaceAutocomplete('               ')).rejects.toThrow('INVALID_QUERY')
    })

    it('handles no results', async () => {
      const res = await getPlaceAutocomplete('asfasffasfasafsafs');
      expect(res).toStrictEqual([])
    })

    it('handles error', async () => {
      expect(getPlaceAutocomplete('')).rejects.toThrow()
    })

    describe('upstream API errors: 500', () => {
      let adapter: MockAdapter

      beforeAll(() => {
        adapter = new MockAdapter(axios)
      })

      it('Gracefully handles 500 errors', async () => {
        adapter.onGet("https://api.tomtom.com/search/2/search/error500.json").reply(500, {
          message: 'This is a mock 500 response'
        });

        const res = await getPlaceAutocomplete('error500');
        expect(res).toStrictEqual([])
      })
    })
  })
})
