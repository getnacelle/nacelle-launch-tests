export default {
  mounted () {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    }
    const vm = this
    const onChange = (changes, observer) => {
      if (changes[0].isIntersecting) {
        vm.fetchMore()
      }
    }

    if (this.$refs.fetchMore) {
      const observer = new IntersectionObserver(onChange, options)
      const observee = this.$refs.fetchMore

      observer.observe(observee)
    }
  }
}
