<template>
  <div class="account-dashboard">
    <account-navigation />
    <div class="dashboard-main">
      <section>
        <h2>Account Information</h2>
        <customer-form />
      </section>
    </div>
  </div>
</template>

<script>
import AccountNavigation from '~/components/account/AccountNavigation'
import CustomerForm from '~/components/account/CustomerForm'
export default {
  components: {
    AccountNavigation,
    CustomerForm,
  },
}
</script>