import React, { useContext, useState, useEffect } from 'react';
import { AccountContext } from 'providers/Account';
import Link from 'next/link';

const OrdersTable = () => {
  const { accountData, accountDispatcher } = useContext(AccountContext);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!isFetched && accountData.orders) {
      accountDispatcher({
        type: 'FETCH_ORDERS'
      });
    }
    setIsFetched(true);
  }, [accountDispatcher, accountData.orders, isFetched]);

  return (
    <div>
      {accountData.orders && accountData.orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th scope="col" width="100">
                Order
              </th>
              <th scope="col" width="300">
                Date
              </th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {accountData.orders.map((order) => (
              <tr key={order.id}>
                <th data-label="Order" scope="row">
                  <Link href={order.order_status_url}>
                    <a aria-label={`Order number ${order.name}`}>
                      {order.name}
                    </a>
                  </Link>
                </th>
                <td data-label="Date">
                  <time dateTime={order.processed_at}>
                    {order.processed_at}
                  </time>
                </td>
                <td data-label="Total">{order.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h3>No orders</h3>
      )}
    </div>
  );
};

export default OrdersTable;
