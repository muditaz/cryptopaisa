import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Col, Row, Typography } from "antd";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CRYPTO_INFO_URL, GLOBAL_STATS_CRYPTOS_API_OPTIONS } from "../constants/constants";
import { apiCall } from "../utils/utils";

Chart.register(...registerables);

const { Title } = Typography;

const LineChart = ({ cryptoId, timePeriod, currentPrice, coinName }) => {
    const dispatch = useDispatch();
    const cryptoHistory = useSelector((state) => {return(state.cryptoItemInfo[cryptoId].timePeriod[timePeriod])});

    const getCryptoHistory = async () => {
        const url = CRYPTO_INFO_URL + cryptoId + `/history?timeperiod=${timePeriod}`;
        const options = GLOBAL_STATS_CRYPTOS_API_OPTIONS;
        let cryptoHistoryResult;
        if(!cryptoHistory)
        cryptoHistoryResult = await apiCall(url, options);
        if(cryptoHistoryResult)
        dispatch({type: 'setCryptoItemHistory', payload: {cryptoId, timePeriod, cryptoHistoryResult: cryptoHistoryResult?.data}});
    };

    useEffect(() => {
        getCryptoHistory();
    }, [timePeriod]);

    if(!cryptoHistory)
    return 'Loading...'

    const cryptoPrice = [];
    const cryptoTimestamp = [];
    for(let i = 0; i < cryptoHistory.history.length; i++) {
        cryptoPrice.push(cryptoHistory.history[i].price);
        cryptoTimestamp.push(new Date(cryptoHistory.history[i].timestamp * 1000).toLocaleDateString());
    }
    const data = {
        labels: cryptoTimestamp,
        datasets: [
          {
            label: 'Price In USD',
            data: cryptoPrice,
            fill: false,
            backgroundColor: '#0071bd',
            borderColor: '#0071bd',
          },
        ],
    };
    const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
    };

    
    return(
        <>
            <Row className="chart-header">
                <Title level={2} className="chart-title">{coinName} Price Chart</Title>
                <Col className="price-container">
                    <Title level={5} className="price-change">{cryptoHistory?.change > 0 ? '+' : ''}{cryptoHistory?.change}%</Title>
                    <Title level={5} className="current-price">Current {coinName} Price: ${currentPrice}</Title>
                </Col>
            </Row>
            <Line data={data} options={options} />
        </>
    );
};

export default LineChart;