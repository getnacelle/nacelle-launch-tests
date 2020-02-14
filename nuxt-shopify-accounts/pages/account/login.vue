<template>
  <div class="page page-login">
    <section class="section section-header">
      <h1>Login</h1>
    </section>

    <section class="section section-login">
      <form
        ref="form"
        method="post"
        accept-charset="UTF-8"
        novalidate="novalidate"
        @submit.prevent="submitForm"
      >
        <input type="hidden" name="form_type" value="customer_login">
        <input type="hidden" name="utf8" value="✓">
        <input type="hidden" name="return_url" value="/account">
        <input type="text" name="customer[email]" placeholder="email" v-model="form.email" />
        <input type="password" name="customer[password]" placeholder="password" v-model="form.password" />
        <button class="button">Login</button>

        <ul v-if="userErrors.length">
          <li>Error:</li>
          <li class="error" v-for="(error, index) in userErrors" :key="index">{{ error.message }}</li>
        </ul>
      </form>

      <br>
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
import NacellePassport from '~/components/NacellePassport.vue'
export default {
  middleware: 'notAuthenticated',
  components: {
    NacellePassport
  },
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  async mounted () {
  },
  computed: {
    ...mapState('account', ['customerAccessToken', 'userErrors'])
  },
  methods: {
    ...mapActions('account', ['login', 'checkoutCustomerAssociate']),
    async submitForm () {
      const { email, password } = this.form
      const response = await this.login({ email, password })

      if (response.multipassUrl) {
        window.location.href = response.multipassUrl
      }
    },
  }
}
</script>

<style scoped>
  .hidden-label {
    height: 0;
    width: 0;
    opacity: 0;
    display: inline-block;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }
  th, td {
    text-align: left;
    border: 1px solid #e8e9eb;
    padding: 10px 14px;
  }
  .logout-link {
    margin: 0 10px;
    font-size: 9px;
  }
  .error {
    color: #8f1212
  }
</style>