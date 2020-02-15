<template>
  <div class="page page-login">
    <section class="section section-header">
      <h1>Login</h1>
    </section>

    <section class="section section-login">
      <login-form />
      <!-- Social Login -->
      <nacelle-passport baseUrl="http://localhost:3333"/>
      <nuxt-link
        :to="`/account/recover`"
        class="breadcrumb"
      >
        Forgot your password?
      </nuxt-link>
      <nuxt-link
        :to="`/account/register`"
        class="breadcrumb"
      >
        Create Account
      </nuxt-link>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import NacellePassport from '~/components/NacellePassport'
import LoginForm from '~/components/LoginForm'
export default {
  middleware: 'notAuthenticated',
  components: {
    NacellePassport,
    LoginForm
  },
  data () {
    return {
    }
  },
  async mounted () {
  },
  computed: {
    ...mapState('account', ['customerAccessToken', 'userErrors'])
  },
  methods: {
  }
}
</script>

<style scoped>
</style>