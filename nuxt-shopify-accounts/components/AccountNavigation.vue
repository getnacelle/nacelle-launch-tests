<template>
  <aside class="account-navigation">
    <ul>
      <li><account-link text="Dashboard" view="dashboard" /></li>
      <li><account-link text="Information" view="information" /></li>
      <li><account-link text="Address Book" view="addresses" /></li>
      <li><account-link text="My Orders" view="orders" /></li>
    </ul>
  </aside>
</template>

<script>
import AccountLink from '~/components/AccountLink'
export default {
  components: {
    AccountLink
  }
}
</script>