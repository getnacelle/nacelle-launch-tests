<template>
  <div class="site-footer">
    <div class="container">
      <!-- TEMPORARY FOOTER START -->
      <div class="column is-6 is-offset-3 logo has-text-centered">
        <nuxt-link to="/">
          <strong>{{ name }}</strong>
        </nuxt-link>

        <locale-selector :localeList="localeList" />

      </div>
      <div class="column is-12 has-text-centered">© {{currentYear}}</div>
      <!-- TEMPORARY FOOTER END -->

      <!-- <div class="columns is-multiline is-marginless">
        <div class="column is-3 logo has-text-centered">
          <img :src="logoSrc" :alt="name" />
        </div>

        <div class="column is-3 has-text-centered-mobile">
          <h4 class="title is-5">Shop</h4>
          <ul>
            <li v-for="(link, index) in shopMenu" :key="index">
              <nuxt-link :to="link.to">{{ link.title }}</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="column is-3 has-text-centered-mobile">
          <h4 class="title is-5">About</h4>
          <ul>
            <li v-for="(link, index) in aboutMenu" :key="index">
              <nuxt-link :to="link.to">{{ link.title }}</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="column is-3 has-text-centered-mobile">
          <h4 class="title is-5">Account</h4>
          <ul>
            <li v-for="(link, index) in accountMenu" :key="index">
              <nuxt-link :to="link.to">{{ link.title }}</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="column is-12 has-text-centered">© NACELLE 2019</div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import LocaleSelector from '~/components/nacelle/LocaleSelector'
import { defaultLocales } from '../../tests/mocks/defaultObjects'

export default {
  components: {
    LocaleSelector
  },
  data() {
    return {
      localeList: defaultLocales.locales
    }
  },
  computed: {
    ...mapState('space', ['id', 'name', 'linklists']),
    ...mapGetters('space', ['getLocalizedLinks']),
    aboutMenu() {
      return this.getLocalizedLinks('about')
    },
    shopMenu() {
      return this.getLocalizedLinks('shop')
    },
    accountMenu() {
      return this.getLocalizedLinks('account')
    },
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
.site-footer {
  padding-top: 2rem;
}

.logo {
  display: flex;
  justify-content: center;

  @media screen and (max-width: 786px) {
    align-content: center;
  }
}

img {
  max-width: 50%;
  align-self: center;
}

.title {
  margin-bottom: 0.5em;
}

a {
  color: #3b3b3b;
  letter-spacing: 0.016875rem;
}
</style>
