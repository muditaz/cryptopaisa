export const GLOBAL_STATS_CRYPTOS_BASE_URL =
  "https://coinranking1.p.rapidapi.com/coins";
export const GLOBAL_STATS_CRYPTOS_API_OPTIONS = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": process.env.REACT_APP_CRYPTOS_KEY,
    "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
  },
};

export const NEWS_BASE_URL = 'https://bing-news-search1.p.rapidapi.com/news/search?safeSearch=Off&textFormat=Raw&freshness=Day&q=';
export const NEWS_API_OPTIONS = {
	method: 'GET',
	headers: {
		'X-BingApis-SDK': 'true',
		'X-RapidAPI-Key': process.env.REACT_APP_NEWS_KEY,
		'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
	}
};

export const CRYPTOS_ON_HOME_PAGE = 10;
export const CRYPTOS_ON_CRYPTOCURRENCIES_PAGE = 50;
export const NEWS_ON_HOME_PAGE = 6;
export const NEWS_ON_NEWS_PAGE = 12;

export const DEFAULT_NEWS_CATEGORY = 'Cryptocurrency';