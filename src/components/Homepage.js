import millify from "millify";
import { Typography, Row, Col, Statistic } from "antd";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { GLOBAL_STATS_CRYPTOS_API_OPTIONS, CRYPTOS_ON_HOME_PAGE, GLOBAL_STATS_CRYPTOS_BASE_URL, NEWS_BASE_URL, NEWS_ON_HOME_PAGE, NEWS_API_OPTIONS, DEFAULT_NEWS_CATEGORY } from "../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import Cryptocurrencies from './Cryptocurrencies';
import News from './News';

const { Title } = Typography;

const Homepage = () => {
  const dispatch = useDispatch();
  const globalStats = useSelector((state) => {return(state.globalStats)});

  const getData = async () => {
    if(!globalStats) {
        const globalStatsCryptosURL = GLOBAL_STATS_CRYPTOS_BASE_URL + `?limit=${CRYPTOS_ON_HOME_PAGE}`;
        const response1 = await fetch(globalStatsCryptosURL, GLOBAL_STATS_CRYPTOS_API_OPTIONS);
        const result1 = await response1.json();
        const newsURL = NEWS_BASE_URL + `${DEFAULT_NEWS_CATEGORY}&count=${NEWS_ON_HOME_PAGE}`;
        const response2 = await fetch(newsURL, NEWS_API_OPTIONS);
        const result2 = await response2.json();
        dispatch({type: 'setGlobalStatsCryptosNews', payload: {globalStatsAndCryptos: result1, defaultNews: result2}});
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if(!globalStats) {
    return('Loading...');
  }

  const { total, totalExchanges, totalMarketCap, total24hVolume, totalMarkets } = globalStats;

  return (
    <>
      <Title level={2} className="heading">
        Global Crypto Stats
      </Title>
      <Row>
        <Col span={12}>
          <Statistic title="Total Cryptocurrencies" value={total} />
        </Col>
        <Col span={12}>
          <Statistic title="Total Exchanges" value={millify(totalExchanges)} />
        </Col>
        <Col span={12}>
          <Statistic title="Total Market Cap" value={millify(totalMarketCap)} />
        </Col>
        <Col span={12}>
          <Statistic title="Total 24h Volume" value={millify(total24hVolume)} />
        </Col>
        <Col span={12}>
          <Statistic title="Total Markets" value={millify(totalMarkets)} />
        </Col>
      </Row>
      <div className="home-heading-container">
        <Title level={2} className="home-title">{`Top ${CRYPTOS_ON_HOME_PAGE} Cryptocurrencies in the world`}</Title>
        <Title level={3} className="show-more"><Link to="/cryptocurrencies">Show more</Link></Title>
      </div>
      <Cryptocurrencies simplified />
      <div className="home-heading-container">
        <Title level={2} className="home-title">Latest Crypto News</Title>
        <Title level={3} className="show-more"><Link to="/news">Show more</Link></Title>
      </div>
      <News simplified />
    </>
  );
};

export default Homepage;
