import './OrderBook.scss';

// const log = console.log.bind(console);
function OrderBook({ data, name }) {
    return (
        <div className="table-container ">
            <table className="book-container container">
                <thead>
                    <tr className="book-header row">
                        <th className="col-4">Size (ETH)</th>
                        <th className="col-4">{name} (BTC)</th>
                        <th className="col-4">Total</th>
                    </tr>
                </thead>
                <tbody className="book-content-wrapper">
                    {data.map((item, index) => (
                        <tr className="book-content row" key={index}>
                            <td className="col-4">{item[1]}</td>
                            <td className="col-4">{item[0]}</td>
                            <td className="col-4">{item[2]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderBook;
