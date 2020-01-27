<template>
  <div class="product columns">
    <div class="column is-6">
      <product-media-select-view
        v-if="product && product.featuredMedia && product.media"
        :featured-media="product.featuredMedia"
        :media="product.media"
      />
    </div>
    <div class="column is-5 is-offset-1">
      <product-title :title="product.title" />
      <product-category
        v-if="product.productType"
        :category="product.productType"
      />
      <p class="price">
        <product-price v-if="currentVariant" :price="currentVariant.price" />
      </p>
      <product-description :description="product.description" />

      <div
        v-if="currentVariant"
        class="variant-select nacelle"
      >
        <product-options
          v-show="allOptions[0].values.length > 1"
          :options="allOptions"
          :variant="selectedVariant"
          :variants="product.variants"
          @selectedOptionsSet="setSelected"
          @clear="selectedOptions = []"
        />
        <div class="columns is-mobile">
          <div v-if="allOptionsSelected && selectedVariant" class="column is-half">
            <quantity-selector
              :quantity.sync="quantity"
            />
          </div>
          <div class="column is-half">
            <subscription-add-to-cart-button
              :product="product"
              :variant="selectedVariant"
              :metafields="metafields"
              :all-options-selected="allOptionsSelected"
              :only-one-option="allOptions.length === 1"
              :quantity="quantity"
            />
          </div>
        </div>
        <recharge-widget
          v-if="isSubscription"
          :product="product"
          :variant="currentVariant"
          :metafields.sync="metafields"
          :frequency.sync="frequency"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
// import your own components here
// import ProductSpecial from '~/components/ComponentName'
import allOptionsSelected from '@nacelle/nacelle-vue-components/dist/mixins/allOptionsSelected'
import availableOptions from '@nacelle/nacelle-vue-components/dist/mixins/availableOptions'
import productMetafields from '@nacelle/nacelle-vue-components/dist/mixins/productMetafields'

export default {
  components: {
    // export your components by name here:
    // ComponentName
  },
  mixins: [productMetafields, allOptionsSelected, availableOptions],
  props: {
    product: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      metafields: [],
      frequency: undefined,
      quantity: 1
    }
  },
  computed: {
    isSubscription () {
      return this.metafieldsObj.subscriptions
    },
    currentVariant () {
      if (this.selectedVariant) {
        return this.selectedVariant
      } else if (
        this.product &&
        this.product.variants &&
        this.product.variants.length
      ) {
        return this.product.variants[0]
      }

      return undefined
    }
  },
  mounted () {
    // TODO: figure out metafields watcher here for child component.
    // this.$watch(() => this.$refs.recharge.metafields, (value) => { this.sum = value })
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    onVariantSelected ({ selectedVariant }) {
      this.selectedVariant = selectedVariant
    }
  }
}
</script>

<style lang="scss" scoped>
.price {
  margin-bottom: 1rem;
}
</style>
