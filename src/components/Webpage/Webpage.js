import { useEffect, useState } from 'react';
import * as dataServices from 'src/services/dataServices';
import './Webpage.scss';
import takeDecimal from 'src/assets/functions/takeDecimal';
import OrderBook from '../OrderBook/OrderBook';

function Webpage() {
    const [bid, setBid] = useState([]);
    const [ask, setAsk] = useState([]);
    const [totalBidAmount, setTotalBidAmount] = useState();
    const [totalAskSize, settotalAskSize] = useState();

    const handleBidData = (data) => {
        //1. calculate total amount = size * bid_price
        data.map((bid) => bid.push(takeDecimal(bid[0] * bid[1], 8)));
        //2. total bid amount < 5
        let totalBidAmount = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i][2] + totalBidAmount >= 5) {
                data = data.slice(0, i);
                break;
            }
            totalBidAmount += data[i][2];
        }
        setTotalBidAmount(takeDecimal(totalBidAmount, 8));
        //3. the highest buying price sort to TOP
        data.sort(([a, b], [c, d]) => c - a || b - d);
        setBid(data);
    };
    const handleAskData = (data) => {
        //1. calculate total amount = size * bid_price
        data.map((ask) => ask.push(takeDecimal(ask[0] * ask[1], 8)));
        //2. total ask size < 150
        let totalAskSize = 0;
        for (let i = 0; i < data.length; i++) {
            if (parseFloat(data[i][1]) + totalAskSize >= 150) {
                data = data.slice(0, i);
                break;
            }
            totalAskSize += parseFloat(data[i][1]);
        }
        settotalAskSize(takeDecimal(totalAskSize, 8));
        //3. the lowest selling price sort to TOP
        data.sort(([c, d], [a, b]) => c - a || b - d);
        setAsk(data);
    };

    useEffect(() => {
        const getDataTrades = async () => {
            let response = await dataServices.getPendingOrders('ETHBTC', 1000);
            if (response) {
                handleBidData(response.data.bids);
                handleAskData(response.data.asks);
            }
        };
        getDataTrades();

        //updating data
        let delay = 10000;
        let wss = new WebSocket('wss://stream.binance.com:9443/ws/ethbtc@depth10@1000ms');

        const updateDataTrades = () => {
            let bidNewData = [];
            let askNewData = [];
            let stockObject = null;
            wss.onmessage = (event) => {
                stockObject = JSON.parse(event.data);
                bidNewData = [...bidNewData, stockObject.bids];
                askNewData = [...askNewData, stockObject.asks];
                //every 1s Websocket push 1 message
                if (bidNewData.length >= Math.floor(delay / 1000)) {
                    handleBidData(bidNewData.flat());
                    handleAskData(askNewData.flat());
                    bidNewData = [];
                    askNewData = [];
                }
            };
            wss.onerror = () => {
                wss.close();
            };
        };

        setInterval(() => {
            updateDataTrades();
        }, delay);
    }, []);

    return (
        <div className="trades-container container">
            <div className="time-update-wrapper">
                <span>Updating per 10s</span>
            </div>
            <div className="order-book-wrapper">
                <div className="bid-wrapper">
                    <OrderBook data={bid} name={'Bid'} />
                    <span className="bid-total-amount total-number">{`The total amount of (size * price) in the bid list:  ${totalBidAmount}`}</span>
                </div>
                <div className="ask-wrapper">
                    <OrderBook data={ask} name={'Ask'} />
                    <span className="ask-total-size total-number">{`The total of size in the ask list:  ${totalAskSize}`}</span>
                </div>
            </div>
        </div>
    );
}

export default Webpage;
