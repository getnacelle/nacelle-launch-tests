<template>
  <div class="page page-addresses">
    <section class="section section-header">
      <h1>Addresses <span class="logout-link"><nuxt-link to="/account">Return to Account Details</nuxt-link></span></h1>
      <ul v-if="userErrors.length">
        <li>Error:</li>
        <li class="error" v-for="(error, index) in userErrors" :key="index">{{ error.message }}</li>
      </ul>

      <button class="button" @click.prevent="toggleEdit" >{{ isEditing ? 'Cancel' : 'Add A New Address' }}</button>
      <div v-if="isEditing" class="create-form">
        <address-form action="create" />
      </div>
    </section>

    <section v-if="addresses.length" class="section section-addresses">
      <ul v-if="addresses.length">
        <address-item
          v-for="(address, index) in addresses"
          :address="address"
          :key="index"
          :showDelete="addresses.length > 1"
        />
      </ul>
      <div v-else><h5>You don't have any addresses yet.</h5></div>
    </section>

    <section class="section section-account">

    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import AddressItem from '~/components/AddressItem'
import AddressForm from '~/components/AddressForm'
export default {
  middleware: 'authenticated',
  data () {
    return {
      isEditing: false
    }
  },
  components: {
    AddressItem,
    AddressForm
  },
  head: {
    script: [
      { src: '/account-head.js' },
    ]
  },
  async mounted () {
    if (this.customerAccessToken) {
      this.$store.dispatch('account/fetchDefaultAddress')
      this.$store.dispatch('account/fetchAddresses')
    }
  },
  watch: {
    customerAccessToken (val) {
      if (val === null) {
        this.$router.push('/')
      }
    },
  },
  computed: {
    ...mapState('account', ['customerAccessToken', 'userErrors', 'defaultAddress', 'addresses']),
  },
  methods: {
    toggleEdit () {
      this.isEditing = !this.isEditing
    }
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
  .error {
    color: #8f1212
  }
</style>