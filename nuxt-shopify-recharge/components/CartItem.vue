<template>
  <div class="columns is-marginless is-mobile flyout-cart-item">
    <router-link
      :to="`${pathFragment}${item.handle}`"
      class="column is-3"
      @click.native="hideCart"
    >
      <product-image
        v-if="productThumbnail && productThumbnail.length > 0"
        :source="productThumbnail"
        :alt="item.title"
      />
    </router-link>

    <div class="column is-9">
      <router-link :to="`${pathFragment}${item.handle}`" @click.native="hideCart">
        <product-title class="flyout-item-title" element="h4" :title="item.title" />
      </router-link>
      <product-variant-title
        :title="variant.title"
        class="flyout-item-variant-title"
      />
      <subscription-cart-line-item-details :line-item="item">
        <template v-slot:default="{ subscription }">
          Your recurring order will be shipped every <strong>{{ subscription.frequency }} {{ subscription.unit }}</strong>
          Easily modify or cancel your subscription up to 3 days before your ship date.
        </template>
      </subscription-cart-line-item-details>
      <div class="flyout-item-details columns is-marginless is-paddingless">
        <product-price class="flyout-item-price" :price="variant.price" />
        <quantity-selector :item="item" :quantity="item.quantity" />
        <cart-flyout-item-remove-button :line-id="item.id" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    pathFragment: {
      type: String,
      default: '/products/'
    }
  },
  computed: {
    productThumbnail () {
      if (
        this.item &&
        this.item.image &&
        this.item.image.thumbnailSrc
      ) {
        return this.item.image.thumbnailSrc
      }

      return ''
    },
    variant () {
      const defaultVariant = {
        id: '',
        title: '',
        price: 0
      }

      if (
        this.item &&
        this.item.variant
      ) {
        return {
          ...defaultVariant,
          ...this.item.variant
        }
      }

      return defaultVariant
    }
  },
  methods: {
    ...mapMutations('cart', ['hideCart'])
  }
}
</script>

<style lang="scss" scoped>
.flyout-cart-item {
  padding: 1rem;
}
.flyout-item-title {
  font-size: 16pt;
  margin-bottom: 0.7rem;
}
.flyout-item-variant-title {
  margin-bottom: 0.5rem;
}
.flyout-item-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flyout-item-price {
  margin-bottom: 0;
}
</style>
