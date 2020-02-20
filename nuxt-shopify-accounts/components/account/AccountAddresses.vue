<template>
  <div class="account-dashboard">
    <account-navigation />
    <div class="dashboard-main">
      <section>
        <h2>Address Book</h2>
        <addresses />
      </section>
    </div>
  </div>
</template>

<script>
import AccountNavigation from '~/components/account/AccountNavigation'
import Addresses from '~/components/account/Addresses'
export default {
  components: {
    AccountNavigation,
    Addresses,
  },
}
</script>