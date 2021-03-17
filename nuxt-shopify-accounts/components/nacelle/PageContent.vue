<template>
  <div class="page-content nacelle">
    <div v-if="page">
      <div v-for="section in page.sections" :key="section.id">
        <component
          :is="getComponentDefinition(section.sys.contentType.sys.id)"
          v-if="section.sys.contentType"
          :id="section.fields.handle"
          v-bind="section.fields"
          :type="section.sys.contentType.sys.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { pascalCase } from 'pascal-case'

export default {
  props: {
    page: {
      type: Object,
      default: () => ({
        source: '',
        sections: []
      })
    }
  },
  methods: {
    getComponentDefinition(def) {
      if (this.$options.components[pascalCase(def)]) {
        return def
      } else {
        return 'NacelleComponentPlaceholder'
      }
    }
  }
}
</script>

<style></style>
