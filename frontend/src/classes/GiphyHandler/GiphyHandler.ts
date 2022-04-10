import DebugLogger from '../DebugLogger';
import { GiphySearchResult } from './GiphyHandlerTypes';

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
      offset: offset ?? 0,
    };

    giphySearchURL.search = new URLSearchParams(JSON.stringify(searchParams)).toString();

    try {
      const data = await fetch(giphySearchURL.href);
      const result = (await data.json()) as GiphySearchResult;
      const isValid = GiphyHandler.validateSearchResult(result);
      return isValid ? result : null;
    } catch (err) {
      this.logger.error('Error retrieving data from GIPHY API: ', err);
      return null;
    }
  }

  private static validateSearchResult(searchResult: GiphySearchResult): boolean {
    return searchResult?.meta?.status === 200;
  }
}

export default GiphyHandler;
