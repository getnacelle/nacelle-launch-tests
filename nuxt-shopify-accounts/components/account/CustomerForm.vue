<template>
  <form
    method="post"
    :action="`/account/customer`"
    accept-charset="UTF-8"
  >
    <input type="hidden" name="form_type" value="customer"><input type="hidden" name="utf8" value="✓">
    <h2>Edit Customer</h2>

    <div class="grid">
      <div class="grid__item medium-up--one-half">
        <label for="FirstName">First Name</label>
        <input type="text" id="FirstName" name="customer[first_name]" v-model="firstName" autocomplete="given-name">
      </div>

      <div class="grid__item medium-up--one-half">
        <label for="LastName">Last Name</label>
        <input type="text" id="LastName" name="customer[last_name]" v-model="lastName" autocomplete="family-name">
      </div>
    </div>

    <label for="Email">Email</label>
    <input type="text" id="Email" name="customer[email]" v-model="email" autocomplete="email">

    <label for="Phone">Phone</label>
    <input type="text" id="Phone" name="customer[phone]" v-model="phone" autocomplete="phone">

    <label for="Password">Password</label>
    <input type="password" id="Password" name="customer[password]" v-model="password" autocomplete="password">

    <div class="text-center">
      <input type="checkbox" id="AcceptsMarketing" name="customer[accepts_marketing]" v-model="acceptsMarketing">
      <label for="AcceptsMarketing">Accepts Marketing</label>

      <div><input type="submit" class="button" @click.prevent="submitForm" value="Save"></div>
    </div>

    <input type="hidden" name="_method" value="put">
  </form>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      firstName: '',
      lastName: '',
      displayName: '',
      email: '',
      phone: '',
      password: '',
      acceptsMarketing: ''
    }
  },
  mounted () {
    if (this.customer) {
      for (const key in this.customer) {
        this[key] = this.customer[key]
      }
    }
  },
  computed: {
    ...mapState('account', ['customer']),
  },
  methods: {
    ...mapActions('account', ['updateCustomer']),
    async submitForm () {
      await this.updateCustomer({
        customer: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
          password: this.password,
          acceptsMarketing: this.acceptsMarketing
        }
      })

      this.$router.push('/account')
    }
  }
}
</script>