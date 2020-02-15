<template>
  <div class="grid-container">
    <div>
      <label>Name</label>
      <span>{{ customer.displayName }}</span>
    </div>

    <div>
      <label>Phone</label>
      <span>{{ customer.phone }}</span>
    </div>

    <div>
      <label>Email</label>
      <span>{{ customer.email }}</span>
    </div>

    <div>
      <label>Password</label>
      <span>•••••••••••</span>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("account", [
      "customerAccessToken",
      "userErrors",
      "customer",
    ]),
  },
}
</script>

<style lang="scss">
.grid-container {
  display: grid;
}
</style>