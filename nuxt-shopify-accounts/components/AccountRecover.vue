<template>
  <div class="account-recover">
    <div>
      <span>Forgot your Password?</span>
    </div>

    <recover-form />

    <account-link text="Back" view="login" />
  </div>
</template>

<script>
import RecoverForm from '~/components/RecoverForm'
import AccountLink from '~/components/AccountLink'
export default {
  components: {
    RecoverForm,
    AccountLink
  }
}
</script>