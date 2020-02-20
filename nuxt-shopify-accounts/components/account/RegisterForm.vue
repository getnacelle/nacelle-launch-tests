<template>
  <form
    ref="form"
    method="post"
    accept-charset="UTF-8"
    novalidate="novalidate"
    @submit.prevent="submitForm"
  >
    <input type="hidden" name="form_type" value="create_customer">
    <input type="hidden" name="utf8" value="✓">
    <input type="hidden" name="return_url" value="/account">
    <input type="text" name="customer[first_name]" placeholder="First Name" autocomplete="given-name" v-model="form.firstName" />
    <input type="text" name="customer[last_name]" placeholder="Last Name" autocomplete="family-name" v-model="form.lastName" />
    <input type="text" name="customer[email]" placeholder="email" autocomplete="email" v-model="form.email" />
    <input type="password" name="customer[password]" placeholder="password" v-model="form.password" />
    <button class="button">Create</button>

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
        firstName: '',
        lastName: '',
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
    ...mapActions('account', ['register']),
    async submitForm () {
      const { firstName, lastName, email, password } = this.form
      await this.register({ firstName, lastName, email, password })
      // TODO: handle success
      this.$router.push('/')
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