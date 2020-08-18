<template>
  <input
    type="text"
    :placeholder="placeholderText"
    class="input nacelle"
    v-model="localQuery"
    @keyup="setQueryInStore"
    :ref="`${position}-search-input`"
  />
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  props: {
    placeholderText: {
      type: String,
      default: 'Search products..'
    },
    position: {
      type: String
    }
  },
  watch: {
    $route(newRoute) {
      if (this.position === 'global') {
        this.localQuery = null
        this.$refs['global-search-input'].blur()
      }
    },
    query(newVal) {
      if (newVal == null) {
        this.localQuery = null
      }
      if (this.position !== 'global' && newVal) {
        this.localQuery = newVal.value
      }
    }
  },
  data() {
    return {
      localQuery: null
    }
  },
  computed: {
    ...mapState('search', ['query'])
  },
  methods: {
    ...mapMutations('search', ['setQuery']),
    ...mapActions('events', ['searchProducts']),
    setQueryInStore(e) {
      if (e.key !== 'Enter') {
        this.setQuery({ value: this.localQuery, origin: this.position })
      }

      // Check that the key press is a letter or number and that
      // local query has a value before tracking an event
      if (/^[a-z0-9]$/i.test(e.key) && this.localQuery) {
        const trackSearchEvent = this.debounce(this.searchProducts, 500)
        trackSearchEvent({ query: this.localQuery })
      }
    },
    debounce(fn, debounceTime) {
      return (...args) => {
        if (this.timeout !== null) {
          clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(() => fn(...args), debounceTime)
      }
    }
  },
  created() {
    if (this.query && this.position !== 'global') {
      this.localQuery = this.query.value
    }
  },
  mounted() {
    if (this.position !== 'global') {
      this.$refs[`${this.position}-search-input`].focus()
    }
  }
}
</script>
<style lang="scss" scoped></style>
