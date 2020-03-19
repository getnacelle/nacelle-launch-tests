<template>
  <li class="address">
    <p>
      <span>{{ address.name }}</span><br>
      <span v-for="(item, itemIndex) in address.formatted" :key="itemIndex">{{item}}<br></span>
    </p>
    <br>
    <div class="button-wrapper">
      <button class="button" @click.prevent="toggleEdit" >{{ isEditing ? 'Cancel' : 'Edit' }}</button>
      <button v-if="showDelete" class="button" @click.prevent="deleteAddress({ id: address.id })">Delete</button>
    </div>
    <div v-if="isEditing" class="edit-form">
      <address-form :address="address" action="update" :isDefaultAddress="isDefaultAddress" />
    </div>
    <br>
    <br>
  </li>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import AddressForm from '~/components/account/AddressForm'
export default {
  props: ['address', 'showDelete', 'isDefaultAddress'],
  data () {
    return {
      isEditing: false
    }
  },
  components: {
    AddressForm
  },
  filters: {
    formatAddress(value) {
      const addressString = `
        ${value.name}
      `
      value.formatted.forEach((item) => {
        addressString.concat(`
          ${item}<br>
        `)
      })
      return addressString
    }
  },
  methods: {
    ...mapActions('account', ['deleteAddress']),
    toggleEdit () {
      this.isEditing = !this.isEditing
    }
  }
}
</script>

<style scoped>
</style>