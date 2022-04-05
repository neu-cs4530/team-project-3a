class GiphyHandler {
  private static _instance: GiphyHandler;

  private static _apiKey = process.env.REACT_APP_GIPHY_API_KEY;

  private static _giphyURLBase = 'https://api.giphy.com/v1';

  public static getInstance(): GiphyHandler {
    if (!GiphyHandler._instance) {
      GiphyHandler._instance = new GiphyHandler();
    }

    return GiphyHandler._instance;
  }

  public static async getGifsBySearchTerm(searchTerm: string) {
    const giphySearchURL = new URL(`${this._giphyURLBase}/gifs/search`);
    const searchParams = { api_key: this._apiKey!, q: searchTerm, lang: 'en' };

    giphySearchURL.search = new URLSearchParams(searchParams).toString();

    const data = await fetch(giphySearchURL.href);

    const result = await data.json();
    console.log(result);
    return result;
  }
}

export default GiphyHandler;
