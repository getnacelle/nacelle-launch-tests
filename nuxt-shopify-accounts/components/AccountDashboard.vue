<template>
  <div class="account-dashboard">
    <account-navigation />
    <div class="dashboard-main">
      <section>
        <h2>Account Information</h2>
        <customer />
      </section>
      <section>
        <h2>Address Book</h2>
        <addresses />
      </section>
      <section>
        <h2>My Orders</h2>
        <orders />
      </section>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import AccountNavigation from '~/components/AccountNavigation'
import Customer from '~/components/Customer'
import Addresses from '~/components/Addresses'
import Orders from '~/components/Orders'
export default {
  components: {
    AccountNavigation,
    Customer,
    Addresses,
    Orders
  }
}
</script>