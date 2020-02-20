<template>
  <div>
    <ul v-if="addresses.length">
      <address-item
        v-for="(address, index) in addresses"
        :address="address"
        :key="index"
        :showDelete="addresses.length > 1"
      />
    </ul>
    <div v-else><h5>You don't have any addresses yet.</h5></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import AddressItem from '~/components/account/AddressItem'
export default {
  components: {
    AddressItem,
  },
  computed: {
    ...mapState("account", [
      "customerAccessToken",
      "userErrors",
      "addresses",
    ]),
  },
}
</script>