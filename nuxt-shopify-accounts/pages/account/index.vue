<template>
  <div class="page page-account">
    <section class="section section-header">
      <h1>Account <span class="logout-link"><a>logout</a></span></h1>
    </section>

    <section class="section section-orders">
      <h2>Order History</h2>
      <table v-if="orders" class="responsive-table">
        <thead>
          <tr>
            <th scope="col">Order</th>
            <th scope="col">Date</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <th data-label="Order" scope="row">
              <a :href="order.statusUrl" class="button" :aria-label="`Order number ${order.name}`">{{ order.name }}</a>
            </th>
            <td data-label="Date"><time :datetime="order.processedAt">{{ order.processedAt | formatDate }}</time></td>
            <td data-label="Total">{{ order.totalPriceV2.amount }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else><h5>You haven't placed any orders yet.</h5></div>
    </section>

    <section class="section section-account">
      <h2>Account Details</h2>
      
      <div v-if="defaultAddress">
        <ul>
          <li>{{ defaultAddress.name }}</li>
          <li v-for="(item, index) in defaultAddress.formatted" :key="index" >{{ item }}</li>
        </ul>

        <button class="button">View Addresses ({{ addresses.length }})</button>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  middleware: 'authenticated',
  data () {
    return {
    }
  },
  async mounted() {
    await this.$store.dispatch('account/readCustomerAccessToken')
    if (this.customerAccessToken) {
      this.$store.dispatch('account/fetchOrders')
      this.$store.dispatch('account/fetchDefaultAddress')
      this.$store.dispatch('account/fetchAddresses')
    }
  },
  filters: {
    formatDate(value) {
      const MM = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const DD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const date = new Date(value)
      const year = date.getFullYear()
      const month = MM[date.getMonth()]
      const day = date.getDate()
      const dayOfWeek = DD[date.getDay()]
      return `${dayOfWeek}, ${month} ${day}, ${year}`
    }
  },
  computed: {
    ...mapState('account', ['customerAccessToken', 'orders', 'defaultAddress', 'addresses'])
  },
  methods: {
    ...mapActions('account', ['logout'])
  }
}
</script>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }
  th, td {
    text-align: left;
    border: 1px solid #e8e9eb;
    padding: 10px 14px;
  }
  .logout-link {
    margin: 0 10px;
    font-size: 9px;
  }
</style>