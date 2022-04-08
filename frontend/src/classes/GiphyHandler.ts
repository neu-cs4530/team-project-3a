class GiphyHandler {
  private static _apiKey = process.env.REACT_APP_GIPHY_API_KEY;

  private static _giphyURLBase = 'https://api.giphy.com/v1';

  /**
   * This method provides functionality to search for GIFs from GIPHY.
   *
   * @param searchTerm the search term to search the string by
   * @returns an array of objects containing search results from GIPHY
   */
  public static async getGifsBySearchTerm(searchTerm: string) {
    const giphySearchURL = new URL(`${this._giphyURLBase}/gifs/search`);
    const searchParams = { api_key: this._apiKey ?? '', q: searchTerm, lang: 'en' };

    giphySearchURL.search = new URLSearchParams(searchParams).toString();

    const data = await fetch(giphySearchURL.href);

    const result = await data.json();

    return result;
  }
}

export default GiphyHandler;
