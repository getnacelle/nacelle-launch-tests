<template>
  <div class="page page-login">
    <section class="section section-header">
      <h1>Login</h1>
    </section>

    <section class="section section-login">
      <h2>Login GraphQL</h2>
      <form
        ref="form"
        method="post"
        accept-charset="UTF-8"
        novalidate="novalidate"
        :action="action"
        @submit.prevent="submitForm"
      >
        <input type="hidden" name="form_type" value="customer_login">
        <input type="hidden" name="utf8" value="✓">
        <input type="hidden" name="return_url" value="/account">
        <input type="text" name="customer[email]" placeholder="email" v-model="loginForm.email" />
        <input type="password" name="customer[password]" placeholder="password" v-model="loginForm.password" />
        <button class="button">Login</button>

        <ul v-if="userErrors.length">
          <li>Error:</li>
          <li class="error" v-for="(error, index) in userErrors" :key="index">{{ error.message }}</li>
        </ul>
      </form>

      <!-- <a>Forgot your password?</a> -->
      <!-- <a>Create Account</a> -->
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import axios from 'axios'
export default {
  middleware: 'notAuthenticated',
  data () {
    return {
      loginForm: {
        email: '',
        password: ''
      }
    }
  },
  mounted() {
  },
  computed: {
    ...mapState('account', ['customerAccessToken', 'userErrors']),
    ...mapGetters('cart', ['checkoutIdForBackend', 'checkoutLineItems']),
    action () {
      return `https://${this.$nacelle.shopifyUrl}/account/login`
    }
  },
  watch: {
    // async customerAccessToken () {
    //   // const checkoutId = await this.fetchCheckoutId()
    //   // this.checkoutCustomerAssociate({ checkoutId })
    //   // this.$refs.form.submit()
    //   // this.$router.push('/account')
    // }
  },
  methods: {
    ...mapActions('account', ['login', 'checkoutCustomerAssociate']),
    ...mapActions('cart', ['saveCheckoutId', 'saveCheckoutUrl', 'getLinkerParam']),
    async submitForm () {
      const response = await this.login({ email: this.loginForm.email, password: this.loginForm.password })

      if (response.multipassUrl) {
        window.location.href = response.multipassUrl
      }
    },
    async fetchCheckoutId () {
      const vm = this
      let processCheckoutObject = {
        id: vm.checkoutIdForBackend,
        url: vm.$store.state.cart.checkoutUrl
      }
      if (!!processCheckoutObject.id) { return processCheckoutObject.id }
      processCheckoutObject = await this.$nacelle
      .checkout({
        cartItems: vm.checkoutLineItems,
        checkoutId: processCheckoutObject.id
      })
      await this.saveCheckoutId(processCheckoutObject.id)
      let url
      const linkerParam = await this.getLinkerParam()

      if (processCheckoutObject.url.includes('?')) {
        url = `${processCheckoutObject.url}&c=${JSON.stringify({})}&${linkerParam}`
      } else {
        url = `${processCheckoutObject.url}?c=${JSON.stringify({})}&${linkerParam}`
      }
      await this.saveCheckoutUrl(url)
      return processCheckoutObject.id
    }
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