import DebugLogger from '../DebugLogger';
import { GiphyRandomResult, GiphySearchResult } from './GiphyHandlerTypes';

/**
 * Functionality for making requests to the GIPHY API to retrieve GIF data.
 */
class GiphyHandler {
  private static _apiKey = process.env.REACT_APP_GIPHY_API_KEY;

  private static _giphyURLBase = 'https://api.giphy.com/v1';

  private static logger: DebugLogger = new DebugLogger('GiphyHandler');

  /**
   * This method provides functionality to search for GIFs from GIPHY.
   *
   * @param searchTerm the search term to search the string by
   * @returns an array of objects containing search results from GIPHY
   */
  public static async getGifsBySearchTerm(
    searchTerm: string,
    offset?: number,
  ): Promise<GiphySearchResult | null> {
    const giphySearchURL = new URL(`${this._giphyURLBase}/gifs/search`);
    const searchParams = {
      api_key: this._apiKey ?? '',
      q: searchTerm,
      lang: 'en',
      rating: 'pg',
      offset: offset?.toString() ?? '0',
    };

    giphySearchURL.search = new URLSearchParams(searchParams).toString();

    try {
      const data = await fetch(giphySearchURL.href);
      const result = (await data.json()) as GiphySearchResult;
      const isValid = GiphyHandler.validateGiphyResponse(result);
      return isValid ? result : null;
    } catch (err) {
      this.logger.error('Error retrieving data from GIPHY API: ', err);
      return null;
    }
  }

  /**
   * This method provides functionality to get a random GIF from GIPHY.
   *
   * @param searchTerm the search term to get the random GIF by
   * @returns a single object containing information about the random GIF, or null on no results found
   */
  public static async getRandomGif(searchTerm: string): Promise<GiphyRandomResult | null> {
    const giphySearchURL = new URL(`${this._giphyURLBase}/gifs/random`);
    const searchParams = {
      api_key: this._apiKey ?? '',
      tag: searchTerm,
      lang: 'en',
      rating: 'pg',
    };

    giphySearchURL.search = new URLSearchParams(searchParams).toString();

    try {
      const data = await fetch(giphySearchURL.href);
      const result = (await data.json()) as GiphyRandomResult;
      const isValid = GiphyHandler.validateGiphyResponse(result);
      return isValid ? result : null;
    } catch (err) {
      this.logger.error('Error retrieving data from GIPHY API: ', err);
      return null;
    }
  }

  private static validateGiphyResponse(
    searchResult: GiphySearchResult | GiphyRandomResult,
  ): boolean {
    return searchResult?.meta?.status === 200;
  }
}

export default GiphyHandler;
