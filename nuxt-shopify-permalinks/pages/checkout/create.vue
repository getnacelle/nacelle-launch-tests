<template>
  
</template>
<script>
export default {
  head: {
    script: [
      { src: '/checkout-referrer-head-check.js' },
    ]
  },
  mounted() {
    const token = this.$route.query.token
    this.$store.dispatch('checkout/updateCheckoutId', token)
  }
}
</script>