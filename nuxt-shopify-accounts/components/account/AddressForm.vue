<template>
  <form
    method="post"
    :action="`/account/addresses/${id}`"
    :id="`address_form_${id}`"
    accept-charset="UTF-8"
  >
    <input type="hidden" name="form_type" value="customer_address"><input type="hidden" name="utf8" value="✓">
    <h2>{{ formTitle }}</h2>

    <div class="grid">
      <div class="grid__item medium-up--one-half">
        <label :for="`AddressFirstName_${id}`">First Name</label>
        <input type="text" :id="`AddressFirstName_${id}`" name="address[first_name]" v-model="firstName" autocomplete="given-name">
      </div>

      <div class="grid__item medium-up--one-half">
        <label :for="`AddressLastName_${id}`">Last Name</label>
        <input type="text" :id="`AddressLastName_${id}`" name="address[last_name]" v-model="lastName" autocomplete="family-name">
      </div>
    </div>

    <label :for="`AddressCompany_${id}`">Company</label>
    <input type="text" :id="`AddressCompany_${id}`" name="address[company]" v-model="company" autocomplete="organization">

    <label :for="`AddressAddress1_${id}`">Address</label>
    <input type="text" :id="`AddressAddress1_${id}`" name="address[address1]" v-model="address1" autocomplete="street-address address-line1">

    <label :for="`AddressAddress2_${id}`">Apartment, suite, etc.</label>
    <input type="text" :id="`AddressAddress2_${id}`" name="address[address2]" v-model="address2" autocomplete="street-address address-line2">

    <div class="grid">
      <div class="grid__item medium-up--one-half">
        <label :for="`AddressCity_${id}`">City</label>
        <input type="text" :id="`AddressCity_${id}`" name="address[city]" v-model="city" autocomplete="address-level2">
      </div>
      <div class="grid__item medium-up--one-half">
        <label :for="`AddressCountry_${id}`">Country/Region</label>
        <select :id="`AddressCountry_${id}`" class="address-country-option" :data-form-id="id" name="address[country]" v-model="countryObject" autocomplete="country">
          <option v-for="country in countries" :key="country.name" :value="country">{{ country.name }}</option>
        </select>
      </div>
    </div>

    <div id="AddressProvinceContainer_3026220941371" style="">
      <label :for="`AddressProvince_${id}`">Province</label>
      <select :id="`AddressProvince_${id}`" name="address[province]" v-model="province" autocomplete="address-level1">
        <option v-for="(province) in provinces" :key="province" :value="province">{{ province }}</option>
      </select>
    </div>

    <div class="grid">
      <div class="grid__item">
        <label :for="`AddressZip_${id}`">Postal/Zip Code</label>
        <input type="text" :id="`AddressZip_${id}`" name="address[zip]" v-model="zip" autocapitalize="characters" autocomplete="postal-code">
      </div>

      <div class="grid__item">
        <label :for="`AddressPhone_${id}`">Phone</label>
        <input type="tel" :id="`AddressPhone_${id}`" name="address[phone]" v-model="phone" autocomplete="phone">
      </div>
    </div>

    <div class="text-center">
      <input type="checkbox" :id="`AddressDefaultAddress_${id}`" name="address[default]" v-model="defaultAddressChecked">
      <label :for="`AddressDefaultAddress_${id}`">Set as default address</label>

      <div><input type="submit" class="button" @click.prevent="submitForm" value="Save"></div>
    </div>

    <input type="hidden" name="_method" value="put">
  </form>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
const countryHandler = require('countrycitystatejson')
export default {
  props: {
    isDefaultAddress: {
      type: Boolean,
      default: false
    },
    address: {
      type: Object,
      default: () => {
        return {
          id: '',
          address1: '',
          address2: '',
          city: '',
          company: '',
          country: 'United States',
          firstName: '',
          lastName: '',
          phone: '',
          province: 'California',
          zip: ''
        }
      }
    },
    action: {
      type: String,
      default: 'update'
    }
  },
  data () {
    return {
      ...this.address,
      defaultAddressChecked: this.isDefaultAddress,
      countries: countryHandler.getCountries(),
      countryObject: {}
    }
  },
  mounted () {
    this.countryObject = this.countries.find(country => country.name === this.country)
  },
  watch: {
    countryObject (value) {
      this.country = value.name
    }
  },
  computed: {
    provinces () {
      return countryHandler.getStatesByShort(this.countryObject.shortName)
    },
    formTitle () {
      return this.action === 'update' ? 'Edit Address' : 'Create Address'
    }
  },
  methods: {
    ...mapActions('account', ['updateAddress', 'createAddress', 'updateDefaultAddress']),
    async submitForm () {
      const response = await this[`${this.action}Address`]({
        id: this.id,
        address: {
          address1: this.address1,
          address2: this.address2,
          city: this.city,
          company: this.company,
          country: this.country,
          firstName: this.firstName,
          lastName: this.lastName,
          phone: this.phone,
          province: this.province,
          zip: this.zip
        }
      })

      // Update customer's defaultAddress if true
      if (this.defaultAddressChecked) {
        await this.updateDefaultAddress({
          addressId: response.id
        })
      }

      this.$router.push('/account')
    }
  }
}
</script>