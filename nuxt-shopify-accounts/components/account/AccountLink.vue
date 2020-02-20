<template>
  <a
    @click.prevent="setModalView(view)"
    class="tab breadcrumb"
  >
    {{ text }}
  </a>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  props: ['text', 'view'],
  methods:  {
    ...mapMutations('account', ['setModalView'])
  }
}
</script>