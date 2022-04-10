import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { nanoid } from 'nanoid';
import GiphyHandler from './GiphyHandler';
import { GiphySearchResult } from './GiphyHandlerTypes';

enableFetchMocks();

describe('GiphyHandler', () => {
  beforeAll(() => {
    fetchMock.doMock();
  });
  beforeEach(() => {
    fetchMock.mockClear();
  });
  afterAll(() => {
    fetchMock.mockClear();
    fetchMock.dontMock();
  });
  describe('Test validation works properly', () => {
    it('should validate on correct response', async () => {
      const goodGiphyResponse: GiphySearchResult = {
        meta: {
          status: 200,
          response_id: nanoid(),
          msg: 'message',
        },
        data: [],
        pagination: {
          count: 0,
          offset: 0,
          total_count: 100,
        },
      };
      fetchMock.mockOnce(JSON.stringify(goodGiphyResponse));

      const result = await GiphyHandler.getGifsBySearchTerm('test');

      expect(fetch).toBeCalledTimes(1);
      expect(result).toStrictEqual(goodGiphyResponse);
    });
    it('should fail to validate on incorrect response', async () => {
      const badGiphyResponse = {
        test: nanoid(),
      };
      fetchMock.mockOnce(JSON.stringify(badGiphyResponse));

      const result = await GiphyHandler.getGifsBySearchTerm('test');

      expect(fetch).toBeCalledTimes(1);
      expect(result).toBe(null);
    });
  });
  describe('Handle rejected promises', () => {
    it('should return null on rejected promise', async () => {
      fetchMock.mockRejectOnce();

      const result = await GiphyHandler.getGifsBySearchTerm('test');
      expect(fetch).toBeCalledTimes(1);
      expect(result).toBe(null);
    });
  });
});
