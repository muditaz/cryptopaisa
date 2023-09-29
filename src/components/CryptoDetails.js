import { useState, useEffect } from "react";
import HTMLReactParser from 'html-react-parser';
import { useParams } from "react-router-dom";
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { CRYPTO_INFO_URL, DEFAULT_TIMEPERIOD, GLOBAL_STATS_CRYPTOS_API_OPTIONS } from "../constants/constants";
import { apiCall } from "../utils/utils";
import LineChart from "./LineChart";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
    const dispatch = useDispatch();
    const { cryptoId } = useParams();
    const [timePeriod, setTimePeriod] = useState(DEFAULT_TIMEPERIOD);
    const cryptoDetails = useSelector((state) => {return(state.cryptoItemInfo[cryptoId])});

    const setCryptoInfoFromAPI = async () => {
        const url = CRYPTO_INFO_URL + cryptoId;
        const options = GLOBAL_STATS_CRYPTOS_API_OPTIONS;
        let cryptoInfoResult;
        if(!cryptoDetails || !cryptoDetails.cryptoInfo) {
            cryptoInfoResult = await apiCall(url, options);
            console.log(cryptoInfoResult);
        }
        if(cryptoInfoResult)
        dispatch({ type: 'setCryptoItemInfo', payload: { cryptoId, cryptoInfoResult: cryptoInfoResult?.data?.coin, timePeriod} });
    };

    useEffect(() => {
        setCryptoInfoFromAPI();
    }, []);

    if(!cryptoDetails)
    return 'Loading...';

    const cryptoInfo = cryptoDetails.cryptoInfo;
    console.log(cryptoInfo);

    const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

    const stats = [
        { title: 'Price to USD', value: `$ ${cryptoInfo?.price && millify(cryptoInfo?.price)}`, icon: <DollarCircleOutlined /> },
        { title: 'Rank', value: cryptoInfo?.rank, icon: <NumberOutlined /> },
        { title: '24h Volume', value: `$ ${millify(cryptoInfo['24hVolume'])}`, icon: <ThunderboltOutlined /> },
        { title: 'Market Cap', value: `$ ${cryptoInfo?.marketCap && millify(cryptoInfo?.marketCap)}`, icon: <DollarCircleOutlined /> },
        { title: 'All-time-high(daily avg.)', value: `$ ${cryptoInfo?.allTimeHigh?.price && millify(cryptoInfo?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
      ];
    
      const genericStats = [
        { title: 'Number Of Markets', value: cryptoInfo?.numberOfMarkets, icon: <FundOutlined /> },
        { title: 'Number Of Exchanges', value: cryptoInfo?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
        { title: 'Aprroved Supply', value: cryptoInfo?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
        { title: 'Total Supply', value: `$ ${cryptoInfo?.supply?.total && millify(cryptoInfo?.supply?.total)}`, icon: <ExclamationCircleOutlined /> },
        { title: 'Circulating Supply', value: `$ ${cryptoInfo?.supply?.circulating && millify(cryptoInfo?.supply?.circulating)}`, icon: <ExclamationCircleOutlined /> },
      ];

    return(
        <Col className="coin-detail-container">
            <Col className="coin-heading-container">
                <Title level={2} className="coin-name">
                    {cryptoInfo.name} Price
                </Title>
                <p>{cryptoInfo.name} price in US Dollar (USD). View value statistics, market cap and supply.</p>
            </Col>
            <Select defaultValue={timePeriod} className="select-timeperiod" placeholder="Select Timeperiod" onChange={(value) => setTimePeriod(value)}>
               {time.map((date) => <Option key={date}>{date}</Option>)}
            </Select>
            <LineChart cryptoId={cryptoId} timePeriod={timePeriod} currentPrice={millify(cryptoInfo?.price)} coinName={cryptoInfo?.name} />
            <Col className="stats-container">
                <Col className="coin-value-statistics">
                    <Col className="coin-value-statistics-heading">
                        <Title className="con-details-heading" level={3}>
                            {cryptoInfo.name} Value Statistics
                        </Title>
                        <p>An overview showing stats of {cryptoInfo.name}</p>
                    </Col>
                    {stats.map(({ icon, title, value }) => (
                    <Col className="coin-stats">
                        <Col className="coin-stats-name">
                            <Text>{icon}</Text>
                            <Text>{title}</Text>
                        </Col>
                        <Text className="stats">{value}</Text>
                    </Col>
          ))}
                </Col>
                <Col className="other-stats-info">
                    <Col className="coin-value-statistics-heading">
                        <Title className="con-details-heading" level={3}>
                            Other Statistics
                        </Title>
                        <p>An overview showing stats of all cryptocurrencies</p>
                    </Col>
                    {genericStats.map(({ icon, title, value }) => (
                    <Col className="coin-stats">
                        <Col className="coin-stats-name">
                            <Text>{icon}</Text>
                            <Text>{title}</Text>
                        </Col>
                        <Text className="stats">{value}</Text>
                    </Col>
                    ))}
                </Col>
                <Col className="coin-desc-link">
                    <Row className="coin-desc">
                        <Title level={3} className="coin-details-heading">What is {cryptoInfo.name}?</Title>
                        {HTMLReactParser(cryptoInfo.description)}
                    </Row>
                    <Col className="coin-links">
                        <Title level={3} className="coin-details-heading">{cryptoInfo.name} Links</Title>
                        {cryptoInfo.links?.map((link) => (
                            <Row className="coin-link" key={link.name}>
                            <Title level={5} className="link-name">{link.type}</Title>
                            <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
                            </Row>
                        ))}
                    </Col>
                </Col>
            </Col>
        </Col>
    );
};

export default CryptoDetails;