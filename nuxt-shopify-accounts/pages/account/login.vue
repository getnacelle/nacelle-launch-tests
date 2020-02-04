<template>
  <div class="page page-login">
    <section class="section section-header">
      <h1>Login</h1>
    </section>

    <section class="section section-login">
      <h2>Login</h2>
      <form @submit.prevent="login({email: loginForm.email, password: loginForm.password})">
        <input type="text" name="email" placeholder="email" v-model="loginForm.email" />
        <input type="password" name="password" placeholder="password" v-model="loginForm.password" />
        <button class="button">Login</button>

        <ul v-if="userErrors">
          <li>Error:</li>
          <li class="error" v-for="(error, index) in userErrors" :key="index">{{ error.message }}</li>
        </ul>
      </form>

      <a>Forgot your password?</a>
      <a>Create Account</a>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
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
    ...mapState('account', ['customerAccessToken', 'userErrors'])
  },
  watch: {
    customerAccessToken () {
      // if(this.customerAccessToken) {  }
      this.$router.push('/account')
    }
  },
  methods: {
    ...mapActions('account', ['login'])
  }
}
</script>

<style scoped>
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