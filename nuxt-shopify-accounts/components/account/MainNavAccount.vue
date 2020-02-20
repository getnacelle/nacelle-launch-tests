<template>
  <button
    class="main-nav-account nacelle"
    @click="toggleAccount"
  >
    <slot name="icon">
      <svg
        aria-hidden="true"
        focusable="false"
        class="icon"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
      >
        <path xmlns="http://www.w3.org/2000/svg" d="m512 256c0-141.488281-114.496094-256-256-256-141.488281 0-256 114.496094-256 256 0 140.234375 113.539062 256 256 256 141.875 0 256-115.121094 256-256zm-256-226c124.617188 0 226 101.382812 226 226 0 45.585938-13.558594 89.402344-38.703125 126.515625-100.96875-108.609375-273.441406-108.804687-374.59375 0-25.144531-37.113281-38.703125-80.929687-38.703125-126.515625 0-124.617188 101.382812-226 226-226zm-168.585938 376.5c89.773438-100.695312 247.421876-100.671875 337.167969 0-90.074219 100.773438-247.054687 100.804688-337.167969 0zm0 0"/>
        <path xmlns="http://www.w3.org/2000/svg" d="m256 271c49.625 0 90-40.375 90-90v-30c0-49.625-40.375-90-90-90s-90 40.375-90 90v30c0 49.625 40.375 90 90 90zm-60-120c0-33.085938 26.914062-60 60-60s60 26.914062 60 60v30c0 33.085938-26.914062 60-60 60s-60-26.914062-60-60zm0 0"/>
      </svg>
    </slot>
    <span class="is-sr-only">Account</span>
  </button>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations('account', ['toggleAccount'])
  }
}
</script>

<style lang="scss" scoped>
.main-nav-account {
  position: relative;
  background: none;
  border: 0;
  outline: 0;
  cursor: pointer;
}

.icon {
  width: 2em;
  height: 2em;
}
</style>

