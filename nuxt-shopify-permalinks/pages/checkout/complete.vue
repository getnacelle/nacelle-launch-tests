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
    // TODO Guard Route if token is not available
    token = this.$route.query.token
    console.log('nacelle token', token)
  },
}
</script>