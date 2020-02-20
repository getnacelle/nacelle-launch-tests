<template>
  <div>
    <table v-if="orders.length" class="responsive-table">
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
            <a
              :href="order.statusUrl"
              class="button"
              :aria-label="`Order number ${order.name}`"
            >{{ order.name }}</a>
          </th>
          <td data-label="Date">
            <time :datetime="order.processedAt">{{ order.processedAt | formatDate }}</time>
          </td>
          <td data-label="Total">{{ order.totalPriceV2.amount }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      <h5>You haven't placed any orders yet.</h5>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  filters: {
    formatDate(value) {
      const MM = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      const DD = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      const date = new Date(value);
      const year = date.getFullYear();
      const month = MM[date.getMonth()];
      const day = date.getDate();
      const dayOfWeek = DD[date.getDay()];
      return `${dayOfWeek}, ${month} ${day}, ${year}`;
    }
  },
  computed: {
    ...mapState("account", [
      "customerAccessToken",
      "userErrors",
      "orders",
    ]),
  },
}
</script>