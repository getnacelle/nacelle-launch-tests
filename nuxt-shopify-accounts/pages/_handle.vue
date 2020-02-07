<template>
  <div class="page">
    <page-content :page="page" :products="products">
      <!-- 
        /****
        /* Customize Your Nacelle Content
        /****
      -->

        <!-- <template v-slot:section="{ section }"> -->

      <!-- 
            * Edit Hero Banner *
                Available slots:
                name: "background", data: "backgroundImgUrl", "mobileBackgroundImgUrl", "backgroundAltTag"
                name: "body", data: "title", "subtitle", "textColor"
                name: "cta", data: "ctaUrl", "ctaText", "ctaHandler"

          <content-hero-banner
            v-if="section.contentType === 'ContentHeroBanner'"
            v-bind="section.data"
          >
            <template v-slot:body="{ title }">
              <h1 class="special-title">{{ title }}</h4>
            </template>
          </content-hero-banner>
      -->

      <!--
            * Edit Side-by-Side Section *
                Available slots:
                name: "body", data: "title", "copy"
                name: "cta", data: "ctaUrl", "ctaText", "ctaHandler"

          <content-side-by-side
            v-if="section.contentType === 'ContentSideBySide'"
            v-bind="section.data"
          />
      -->

      <!--
            * Edit Product Grid *
                Available slots:
                name: "header", data: "title"
                name: "products", data: "products", "columns"

          <content-product-grid
            v-if="section.contentType === 'ContentProductGrid'"
            v-bind="section.data"
          />
      -->

      <!-- 
            * Edit Testimonials *

          <content-testimonials
            v-if="section.contentType === 'ContentTestimonials'"
            v-bind="section.data"
          />
      -->

      <!-- </template> -->
    </page-content>
  </div>
</template>

<script>
import { getPageData } from '@nacelle/nacelle-tools'
export default {
      data () {
      return {
        handle: null,
        page: null,
        noPageData: false
      }
    },
    async asyncData (context) {
      const { params, app, payload } = context
      const { handle } = params
      const { $nacelle } = app

      const pageData = await getPageData({
        handle: pageHandle || handle,
        locale: locale || $nacelle.locale,
        payload
      })

      return {
        ...pageData
      }
    },
    async created () {
      this.handle = pageHandle || this.$route.params.handle

      if (process.browser && !this.page && !this.noPageData) {
        const pageData = await this.$nacelle.content({
          handle: this.handle,
          locale: locale || this.$nacelle.locale
        })

        if (pageData) {
          if (pageData.noData) {
            this.noPageData = true
          } else {
            this.page = pageData
          }
        } else {
          this.noPageData = true
        }
      }
    }
}
</script>
