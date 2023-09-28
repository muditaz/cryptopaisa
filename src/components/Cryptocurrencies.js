import millify from 'millify';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { CRYPTOS_ON_CRYPTOCURRENCIES_PAGE, CRYPTOS_ON_HOME_PAGE, GLOBAL_STATS_CRYPTOS_BASE_URL, GLOBAL_STATS_CRYPTOS_API_OPTIONS } from '../constants/constants';

const Cryptocurrencies = ({ simplified }) => {
    const dispatch = useDispatch();
    const cryptos = useSelector((state) => {return(state.cryptos)});
    const [searchValue, setSearchValue] = useState('');

    const getData = async () => {
        if(!simplified) {
            if(!cryptos || cryptos.length < CRYPTOS_ON_CRYPTOCURRENCIES_PAGE) {
                const url = GLOBAL_STATS_CRYPTOS_BASE_URL + `?limit=${CRYPTOS_ON_CRYPTOCURRENCIES_PAGE}`;
                const options = GLOBAL_STATS_CRYPTOS_API_OPTIONS;
                const response = await fetch(url, options);
                const result = await response.json();
                dispatch({type: 'setCryptos', payload: result?.data?.coins});
            }
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if(!cryptos) 
    return('Loading...');

    const cryptoCards = [];

    for(let i = 0; i < (simplified ? CRYPTOS_ON_HOME_PAGE : cryptos.length); i++) {
        const currency = cryptos[i];
        if(simplified || currency.name.toLowerCase().includes(searchValue.toLowerCase())) {
          cryptoCards.push(
            <Col
            xs={24}
            sm={12}
            lg={6}
            className="crypto-card"
            key={currency.uuid}
          >

            {/* Note: Change currency.id to currency.uuid  */}
            <Link key={currency.uuid} to={`/crypto/${currency.uuid}`}>
              <Card
                title={`${currency.rank}. ${currency.name}`}
                extra={<img className="crypto-image" src={currency.iconUrl} />}
                hoverable
              >
                <p>Price: {millify(currency.price)}</p>
                <p>Market Cap: {millify(currency.marketCap)}</p>
                <p>Daily Change: {currency.change}%</p>
              </Card>
            </Link>
          </Col>
        );
        }
    }

  return (
    <>
    {!simplified && <div className='search-crypto'>
      <Input placeholder='Search Cryptocurrency' onChange={(e) => {setSearchValue(e.target.value)}} />
    </div>}
      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptoCards}
      </Row>
    </>
  );
};

export default Cryptocurrencies;