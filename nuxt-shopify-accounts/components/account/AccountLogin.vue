<template>
  <div class="account-login">
    <div>
      <account-link text="Login" view="login" />
      <account-link text="Sign up" view="register" />
    </div>

    <login-form />
    <account-link text="Forgot your password?" view="recover" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import LoginForm from '~/components/account/LoginForm'
import AccountLink from '~/components/account/AccountLink'
export default {
  components: {
    LoginForm,
    AccountLink
  }
}
</script>