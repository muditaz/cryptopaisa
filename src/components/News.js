import { useEffect, useState } from "react";
import {
  CRYPTOS_ON_CRYPTOCURRENCIES_PAGE,
  DEFAULT_NEWS_CATEGORY,
  GLOBAL_STATS_CRYPTOS_API_OPTIONS,
  GLOBAL_STATS_CRYPTOS_BASE_URL,
  NEWS_API_OPTIONS,
  NEWS_BASE_URL,
  NEWS_ON_HOME_PAGE,
  NEWS_ON_NEWS_PAGE,
} from "../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { Select, Typography, Row, Col, Avatar, Card } from "antd";
import moment from "moment";
import { apiCall } from "../utils/utils";
import Loader from "./Loader";

const { Text, Title } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const dispatch = useDispatch();

  const news = useSelector((state) => {
    return state.news;
  });

  const cryptos = useSelector((state) => {
    return state.cryptos;
  });

  const [newsCategory, setNewsCategory] = useState(DEFAULT_NEWS_CATEGORY);

  const demoImage =
    "https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News";

  const fetchNewsCorrespondingToCategory = async () => {
    let shouldNewsAPIBeCalled = false;
    let shouldCryptoAPIBeCalled = false;
    let limit;
    let newsResults = news[newsCategory];
    let cryptoResults = cryptos;
    if(simplified) {
      shouldNewsAPIBeCalled = !news[newsCategory];
      if(shouldNewsAPIBeCalled)
      limit = NEWS_ON_HOME_PAGE;
    } else {
      shouldNewsAPIBeCalled = newsCategory === DEFAULT_NEWS_CATEGORY ? (news[newsCategory] && news[newsCategory].length < NEWS_ON_NEWS_PAGE) : !news[newsCategory];
      limit = NEWS_ON_NEWS_PAGE;
      shouldCryptoAPIBeCalled = (cryptos && cryptos.length < CRYPTOS_ON_CRYPTOCURRENCIES_PAGE);
    }
    if(shouldNewsAPIBeCalled)
    newsResults = (await apiCall(NEWS_BASE_URL + `${newsCategory}&count=${limit}`, NEWS_API_OPTIONS))?.value;
    if(shouldCryptoAPIBeCalled)
    cryptoResults = (await apiCall(GLOBAL_STATS_CRYPTOS_BASE_URL + `?limit=${CRYPTOS_ON_CRYPTOCURRENCIES_PAGE}`, GLOBAL_STATS_CRYPTOS_API_OPTIONS))?.data?.coins;
    dispatch({ type: 'setNews', payload: { newsKey: newsCategory, newsValue: newsResults, cryptos: cryptoResults } });
  };

  useEffect(() => {
    fetchNewsCorrespondingToCategory();
  }, [newsCategory]);

  if (!news[newsCategory]) return(<Loader />);

  const newsCards = [];
  for (
    let i = 0;
    i < (simplified ? NEWS_ON_HOME_PAGE : news[newsCategory].length);
    i++
  ) {
    const newsItem = news[newsCategory][i];
    newsCards.push(
      <Col xs={24} sm={12} lg={8} key={i}>
        <Card hoverable className="news-card">
          <a href={newsItem.url} target="_blank" rel="noreferrer">
            <div className="news-image-container">
              <Title className="news-title" level={4}>
                {newsItem.name}
              </Title>
              <img
                src={newsItem?.image?.thumbnail?.contentUrl || demoImage}
                alt="news"
                style={{ maxWidth: "200px", maxHeight: "100px" }}
              />
            </div>
            <p>
              {newsItem.description.length > 100
                ? `${newsItem.description.substring(0, 100)}...`
                : newsItem.description}
            </p>
            <div className="provider-container">
              <div>
                <Avatar
                  src={
                    newsItem.provider[0]?.image?.thumbnail?.contentUrl ||
                    demoImage
                  }
                  alt=""
                />
                <Text className="provider-name">
                  {newsItem.provider[0]?.name}
                </Text>
              </div>
              <Text>
                {moment(newsItem.datePublished).startOf("ss").fromNow()}
              </Text>
            </div>
          </a>
        </Card>
      </Col>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="Select a Crypto"
            optionFilterProp="children"
            value={newsCategory}
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value={DEFAULT_NEWS_CATEGORY}>
              {DEFAULT_NEWS_CATEGORY}
            </Option>
            {cryptos &&
              cryptos.map((coin) => (
                <Option value={coin.name}>{coin.name}</Option>
              ))}
          </Select>
        </Col>
      )}
      {newsCards}
    </Row>
  );
};

export default News;
