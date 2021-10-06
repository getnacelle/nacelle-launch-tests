import React from 'react';
import AccountLayout from 'components/Account/Layout/AccountLayout';
import ResetForm from 'components/Account/Reset/ResetForm';

const Activate = () => {
  return (
    <AccountLayout>
      <h1>Activate</h1>
      <ResetForm mode="activate" />
    </AccountLayout>
  );
};

export default Activate;
