class GiphyHandler {
  private static _apiKey = process.env.REACT_APP_GIPHY_API_KEY;

  private static _giphyURLBase = 'https://api.giphy.com/v1';

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
