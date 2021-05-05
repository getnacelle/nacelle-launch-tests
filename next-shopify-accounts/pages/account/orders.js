import React from 'react';
import AccountLayout from 'components/Account/Layout/AccountLayout';
import OrdersTable from 'components/Account/OrdersTable/OrdersTable';

const Orders = () => {
  return (
    <AccountLayout>
      <h1>Orders</h1>
      <OrdersTable />
    </AccountLayout>
  );
};

export default Orders;
