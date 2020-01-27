<template>
  <div class="product-card">
    <router-link :to="`${pathFragment}${product.handle}`">
      <product-image ref="product-image" :source="mediaSrc" />
    </router-link>
    <div class="product-card-details">
      <router-link :to="`${pathFragment}${product.handle}`">
        <product-title :title="product.title" />
      </router-link>
      <product-price :price="product.priceRange.max" />
    </div>
    <div v-if="product && product.id" class="product-card-actions">
      <quantity-selector
        :quantity.sync="quantity"
      />
      <product-add-to-cart-button
        v-if="showAddToCart == true"
        :product="product"
        :variant="currentVariant"
        :all-options-selected="allOptionsSelected"
        :confirmed-selection="confirmedSelection"
        :only-one-option="onlyOneOption"
        :quantity="quantity"
        @click.native="handleAddToCartClick"
      />
      <interface-modal
        :modal-open="optionsModalVisible"
        @closeModal="optionsModalVisible = false"
      >
        <h3 class="modal-title">
          Choose Your Options
        </h3>
        <product-options
          :options="allOptions"
          :only-one-option="onlyOneOption"
          :variant="currentVariant"
          :variants="product.variants"
          @selectedOptionsSet="setSelected"
          @confirmedSelection="confirmedSelection = true, optionsModalVisible = false"
        />
      </interface-modal>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import allOptionsSelected from '@nacelle/nacelle-vue-components/dist/mixins/allOptionsSelected'
import availableOptions from '@nacelle/nacelle-vue-components/dist/mixins/availableOptions'

export default {
  mixins: [allOptionsSelected, availableOptions],
  props: {
    pathFragment: {
      type: String,
      default: '/products/'
    },
    product: {
      type: Object,
      default: () => {
        return {
          priceRange: {
            min: '0.0',
            max: '0.00'
          },
          title: null,
          featuredMedia: {
            src: undefined
          },
          id: null,
          handle: '',
          variants: []
        }
      }
    },
    variant: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showQuantityUpdate: {
      type: Boolean,
      default: true
    },
    showAddToCart: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      optionsModalVisible: false,
      confirmedSelection: false,
      quantity: 1
    }
  },
  computed: {
    ...mapState('cart', ['lineItems']),

    currentVariant () {
      if (this.product.variants && this.product.variants.length === 1) {
        return this.product.variants[0]
      } else {
        return this.selectedVariant
      }
    },
    currentVariantId () {
      if (this.currentVariant && this.currentVariant.id) {
        return this.currentVariant.id
      }

      return undefined
    },
    mediaSrc () {
      if (
        this.product &&
        this.product.featuredMedia &&
        this.product.featuredMedia.src
      ) {
        return this.product.featuredMedia.src
      }

      return undefined
    },
    cartProduct () {
      return {
        image: this.product.featuredMedia,
        title: this.product.title,
        productId: this.product.id,
        price: this.currentPrice,
        handle: this.product.handle,
        variant: this.currentVariant
      }
    },
    productLineItems () {
      const vm = this
      return this.lineItems.filter(item => {
        return item.productId === vm.product.id
      })
    },
    onlyOneOption () {
      if (
        this.product.options &&
        this.product.options.length === 1 &&
        this.product.options[0].values.length === 1
      ) {
        return true
      } else {
        return false
      }
    }
  },

  methods: {
    ...mapMutations('cart', ['showCart']),

    handleAddToCartClick () {
      if (!this.allOptionsSelected) {
        this.optionsModalVisible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-card-details,
.product-card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-card-details /deep/ a {
  flex-basis: 80%;
}
.handler {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
