<template>
  <div class="page page-recover">
    <section class="section section-header">
      <h1>Reset Your Password</h1>
    </section>

    <section class="section section-recover">
      <form
        ref="form"
        method="post"
        accept-charset="UTF-8"
        novalidate="novalidate"
        @submit.prevent="submitForm"
      >
        <input type="hidden" name="form_type" value="recover_customer_password">
        <input type="hidden" name="utf8" value="✓">
        <input type="hidden" name="return_url" value="/account">
        <input type="text" name="customer[email]" placeholder="email" autocomplete="email" v-model="form.email" />
        <button class="button">Recover</button>

        <ul v-if="userErrors.length">
          <li>Error:</li>
          <li class="error" v-for="(error, index) in userErrors" :key="index">{{ error.message }}</li>
        </ul>
      </form>

      <nuxt-link
        :to="`/account/login`"
        class="breadcrumb"
      >
        Login
      </nuxt-link>
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
        email: '',
      }
    }
  },
  mounted() {
  },
  computed: {
    ...mapState('account', ['customerAccessToken', 'userErrors']),
  },
  methods: {
    ...mapActions('account', ['recover']),
    async submitForm () {
      const { email } = this.form
      const response = await this.recover({ email })
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