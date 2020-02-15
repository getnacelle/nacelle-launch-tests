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
import AccountNavigation from '~/components/AccountNavigation'
import CustomerForm from '~/components/CustomerForm'
export default {
  components: {
    AccountNavigation,
    CustomerForm,
  },
}
</script>