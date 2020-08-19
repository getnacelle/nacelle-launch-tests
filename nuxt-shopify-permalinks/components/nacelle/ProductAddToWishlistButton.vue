<template>
  <div @click="toggle" class="add-to-wishlist" :class="isSavedInWishlist ? 'saved' : 'not-saved'">
    <slot name="icon"></slot>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    product: {
      type: Object
    },
    variant: {
      type: Object
    }
  },
  methods: {
    ...mapActions('wishlist', ['addToWishlist', 'removeFromWishlist']),
    toggle() {
      const { variant, product } = this
      if (this.isSavedInWishlist) {
        this.removeFromWishlist({ variantId: variant.id })
      } else {
        this.addToWishlist({
          product,
          variant
        })
      }
    }
  },
  computed: {
    isSavedInWishlist() {
      return !!this.$store.getters['wishlist/getItemByVariantId'](
        this.variant.id
      )
    }
  }
}
</script>

<style scoped>
.add-to-wishlist svg {
  stroke: currentColor;
  stroke-width: 36px;
  width: 18px;
  height: 18px;
}
.add-to-wishlist.saved svg {
  fill: currentColor;
}
.add-to-wishlist.not-saved svg {
  fill: transparent;
}
</style>
