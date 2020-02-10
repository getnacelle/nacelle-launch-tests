<template>
  <div class="page page-reset">
    <section class="section section-header">
      <h1>Reset Account Password</h1>
    </section>

    <section class="section section-reset">
      <form
        ref="form"
        method="post"
        accept-charset="UTF-8"
        novalidate="novalidate"
        @submit.prevent="submitForm"
      >
        <input type="hidden" name="form_type" value="reset_customer_password">
        <input type="hidden" name="utf8" value="✓">
        <input type="hidden" name="return_url" value="/account">
        <input type="hidden" name="token" v-model="form.resetToken">
        <input type="hidden" name="id" v-model="form.customerId">
        <input type="password" name="customer[password]" placeholder="password" v-model="form.password" />
        <button class="button">Reset Password</button>

        <ul v-if="userErrors.length">
          <li>Error:</li>
          <li class="error" v-for="(error, index) in userErrors" :key="index">{{ error.message }}</li>
        </ul>
      </form>

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
      form: {
        password: '',
        resetToken: '',
        customerId: ''
      }
    }
  },
  head: {
    script: [
      { src: '/reset-head.js' },
    ]
  },
  mounted() {
    // TODO Guard Route if resetToken and customerId are not available
    this.form.resetToken = this.$route.query.token
    this.form.customerId = this.$route.query.id
  },
  computed: {
    ...mapState('account', ['customerAccessToken', 'userErrors']),
  },
  methods: {
    ...mapActions('account', ['reset']),
    async submitForm () {
      const { password, resetToken, customerId } = this.form
      await this.reset({ password, resetToken, customerId })
      // TODO: handle success
      this.$router.push('/account/login')
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