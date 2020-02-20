<template>
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
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  mounted() {
  },
  computed: {
    ...mapState('account', ['customerAccessToken', 'userErrors']),
  },
  methods: {
    ...mapActions('account', ['login']),
    async submitForm () {
      const { email, password } = this.form
      const response = await this.login({ email, password })

      if (response.multipassUrl) {
        window.location.href = response.multipassUrl
      }
    }
  }
}
</script>