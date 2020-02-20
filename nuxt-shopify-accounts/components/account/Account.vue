<template>
  <transition name="modal" v-if="modalVisible">
    <div class="modal-mask">
      <div class="modal-wrapper" @click.self="closeModal">
        <div class="modal-container">

          <div class="modal-body">
            <component :is="modalView" />
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import AccountLogin from '~/components/account/AccountLogin'
import AccountRecover from '~/components/account/AccountRecover'
import AccountRegister from '~/components/account/AccountRegister'
import AccountDashboard from '~/components/account/AccountDashboard'
import AccountInformation from '~/components/account/AccountInformation'
import AccountAddresses from '~/components/account/AccountAddresses'
import AccountOrders from '~/components/account/AccountOrders'
export default {
  components: {
    AccountLogin,
    AccountRecover,
    AccountRegister,
    AccountDashboard,
    AccountInformation,
    AccountAddresses,
    AccountOrders
  },
  data () {
    return {

    }
  },
  mounted () {
    if (this.customerAccessToken) {
      this.setModalView('dashboard')
    } else {
      this.setModalView('login')
    }
  },
  watch: {
    customerAccessToken (value) {
      if (value) {
        this.setModalView('dashboard')
      } else {
        this.setModalView('login')
      }
    }
  },
  computed: {
    ...mapState('account', ['customerAccessToken', 'modalVisible', 'modalView']),
  },
  methods: {
    ...mapMutations('account', ['closeModal', 'openModal', 'setModalView']),
  }
}
</script>

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  min-width: 300px;
  width: 80%;
  max-width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.account-dashboard {
  display: inline-flex;
}
.dashboard-main {
  // flex: 80%;
}
</style>>
