export interface GIFData {
  type: string;
  id: string;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;
  import_datetime: string;
  trending_datetime: string;
}

export interface GiphyPagination {
  count: number;
  offset: number;
  total_count: number;
}

export interface GiphyMetaData {
  status: number;
  msg: string;
  response_id: string;
}

export interface GiphySearchResult {
  data: GIFData[] | null;
  pagination: GiphyPagination;
  meta: GiphyMetaData;
}
