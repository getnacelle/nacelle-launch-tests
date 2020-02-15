<template>
  <div class="account-dashboard">
    <account-navigation />
    <div class="dashboard-main">
      <section>
        <h2>My Orders</h2>
        <orders />
      </section>
    </div>
  </div>
</template>

<script>
import AccountNavigation from '~/components/AccountNavigation'
import Orders from '~/components/Orders'
export default {
  components: {
    AccountNavigation,
    Orders,
  },
}
</script>