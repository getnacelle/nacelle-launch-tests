<template>
  <div class="page page-shop">
    <content-hero-banner
      title="Wishlist"
    />
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <product-grid
            v-if="products && products.length > 0"
            :products="products"
            :showAddToCart="true"
            :showQuantityUpdate="true"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ContentHeroBanner from '~/components/nacelle/ContentHeroBanner'
import ProductGrid from '~/components/nacelle/ProductGrid'
import { mapState } from 'vuex'

export default {
  components: {
    ContentHeroBanner,
    ProductGrid
  },
  computed: {
    ...mapState('wishlist', ['items']),
    products() {
      return this.items.map(item => item.product)
    }
  }
}
</script>

<style lang="scss" scoped>
.product {
  .title {
    font-weight: bold;
  }
  img {
    width: 250px;
  }
}
</style>
