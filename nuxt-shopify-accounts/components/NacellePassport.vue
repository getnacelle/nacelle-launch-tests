<template>
  <div>
    <a :href="facebook.url" class="button loginLink">{{ facebook.text }}</a>
    <br>
    <a :href="google.url" class="button loginLink">{{ google.text }}</a>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    props: {
      // For Development Purposes Only
      baseUrl: {
        type: String,
        defualt: 'https://passport.nacellestaging.com'
      }
    },
    data () {
    return {
      facebook: {
        url: '/',
        text: 'Login with Facebook'
      },
      google: {
        url: '/',
        text: 'Login with Google'
      }
    }
  },
  async mounted () {
    this.facebook.url = this.authUrl('facebook')
    this.google.url = this.authUrl('google')

    const email = await this.$cookies.get('ncl_email')
    const strategy = await this.$cookies.get('ncl_strategy')
    if (strategy && email) {
      try {
        const response = await axios.get(`${this.baseUrl}/auth/status`, { withCredentials: true })
        this[strategy].text = this[strategy].text.replace('Login', 'Logged')
        this[strategy].url = '#'
      }
      catch (error) {
        console.error('error', error)
        this.$cookies.remove('ncl_email')
        this.$cookies.remove('ncl_strategy')
      }
    }
  },
  methods: {
    authUrl (strategy) {
      if (process.browser) {
        return `${this.baseUrl}/auth/${strategy}?returnTo=${encodeURIComponent(window.location.href)}`
      } else {
        return '/'
      }
    }
  }
}
</script>