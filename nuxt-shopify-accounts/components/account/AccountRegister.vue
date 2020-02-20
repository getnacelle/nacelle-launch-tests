<template>
  <div class="account-login">
    <div>
      <account-link text="Login" view="login" />
      <account-link text="Sign up" view="register" />
    </div>

    <register-form />

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import RegisterForm from '~/components/account/RegisterForm'
import AccountLink from '~/components/account/AccountLink'
export default {
  components: {
    RegisterForm,
    AccountLink
  }
}
</script>