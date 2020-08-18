<template>
  <div class="product-card nacelle">
    <router-link :to="`${pathFragment}${product.handle}`">
      <product-image :source="mediaSrc" />
    </router-link>
    <div class="product-card-details">
      <router-link :to="`${pathFragment}${product.handle}`">
        <product-title :title="product.title" />
      </router-link>
      <product-price :price="displayPrice" />
    </div>
    <div v-if="product && product.id" class="product-card-actions">
      <quantity-selector v-if="showQuantityUpdate === true" :quantity.sync="quantity" />
      <product-add-to-cart-button
        v-if="showAddToCart === true"
        :product="product"
        :variant="currentVariant"
        :allOptionsSelected="allOptionsSelected"
        :confirmedSelection="confirmedSelection"
        @click.native="handleAddToCartClick"
        :onlyOneOption="onlyOneOption"
        :quantity="quantity"
      ></product-add-to-cart-button>
      <product-add-to-wishlist-button
        class="circle-button is-primary"
        :variant="currentVariant"
        :product="product"
      >
        <template v-slot:icon>
          <svg
            width="120%"
            height="100%"
            viewBox="-42 0 592 469"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xml:space="preserve"
            xmlns:serif="http://www.serif.com/"
            style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
          >
            <path
              d="M471.383,55.578c-26.504,-28.746 -62.871,-44.578 -102.41,-44.578c-29.555,0 -56.621,9.344 -80.45,27.77c-12.023,9.3 -22.918,20.679 -32.523,33.96c-9.602,-13.277 -20.5,-24.66 -32.527,-33.96c-23.825,-18.426 -50.891,-27.77 -80.446,-27.77c-39.539,0 -75.91,15.832 -102.414,44.578c-26.187,28.41 -40.613,67.223 -40.613,109.293c0,43.301 16.137,82.938 50.781,124.742c30.992,37.395 75.535,75.356 127.117,119.313c17.614,15.012 37.579,32.027 58.309,50.152c5.477,4.797 12.504,7.438 19.793,7.438c7.285,0 14.316,-2.641 19.785,-7.43c20.731,-18.129 40.707,-35.152 58.328,-50.172c51.574,-43.949 96.117,-81.906 127.11,-119.305c34.644,-41.8 50.777,-81.437 50.777,-124.742c0,-42.066 -14.426,-80.879 -40.617,-109.289Z"
              style="fill-rule:nonzero;"
            />
          </svg>
        </template>
      </product-add-to-wishlist-button>
      <interface-modal
        :modalOpen="optionsModalVisible"
        v-on:closeModal="optionsModalVisible = false"
      >
        <h3 class="modal-title">Choose Your Options</h3>
        <product-options
          :options="allOptions"
          v-on:selectedOptionsSet="setSelected"
          v-on:confirmedSelection="
            ;(confirmedSelection = true), (optionsModalVisible = false)
          "
          :onlyOneOption="onlyOneOption"
          :variant="currentVariant"
          :variants="product.variants"
        />
      </interface-modal>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import ProductImage from '~/components/nacelle/ProductImage'
import ProductTitle from '~/components/nacelle/ProductTitle'
import ProductPrice from '~/components/nacelle/ProductPrice'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'
import ProductAddToWishlistButton from '~/components/nacelle/ProductAddToWishlistButton'
import InterfaceModal from '~/components/nacelle/InterfaceModal'
import ProductOptions from '~/components/nacelle/ProductOptions'
import allOptionsSelected from '~/mixins/allOptionsSelected'
import availableOptions from '~/mixins/availableOptions'
import getDisplayPriceForCurrency from '~/mixins/getDisplayPriceForCurrency'

export default {
  components: {
    ProductImage,
    ProductTitle,
    ProductPrice,
    QuantitySelector,
    ProductAddToCartButton,
    ProductAddToWishlistButton,
    InterfaceModal,
    ProductOptions
  },
  mixins: [allOptionsSelected, availableOptions, getDisplayPriceForCurrency],
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
      type: Object
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
  data() {
    return {
      optionsModalVisible: false,
      confirmedSelection: false,
      quantity: 0,
      test: false
    }
  },
  watch: {
    quantityTotal() {
      this.confirmedSelection = false
    },
    optionsModalVisible(previous, current) {
      if (!previous && current) {
        this.test = true
        this.productView(this.product)
      }
    }
  },
  computed: {
    ...mapState('cart', ['lineItems']),
    ...mapState('user', ['locale']),
    ...mapGetters('cart', ['quantityTotal']),

    displayPrice() {
      return this.getPriceForCurrency({
        product: this.product,
        fallbackPrice: this.currentVariant.price
      })
    },
    currentVariant() {
      if (this.product.variants && this.product.variants.length == 1) {
        return this.product.variants[0]
      } else {
        return this.selectedVariant
      }
    },
    currentVariantId() {
      if (this.currentVariant && this.currentVariant.id) {
        return this.currentVariant.id
      }

      return undefined
    },
    mediaSrc() {
      if (
        this.product &&
        this.product.featuredMedia &&
        this.product.featuredMedia.src
      ) {
        return this.product.featuredMedia.src
      }

      return undefined
    },
    cartProduct() {
      return {
        image: this.product.featuredMedia,
        title: this.product.title,
        productId: this.product.id,
        price: this.currentPrice,
        handle: this.product.handle,
        variant: this.currentVariant
      }
    },
    productLineItems() {
      const vm = this
      return this.lineItems.filter(item => {
        return item.productId == vm.product.id
      })
    },
    onlyOneOption() {
      if (
        this.allOptions &&
        this.allOptions.length == 1 &&
        this.allOptions[0].values.length == 1
      ) {
        return true
      } else {
        return false
      }
    }
  },

  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapActions('events', ['productView']),
    handleAddToCartClick() {
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
  min-width: 300px;
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
