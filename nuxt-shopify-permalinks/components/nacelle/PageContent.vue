<template>
  <div class="page-content nacelle">
    <slot :page="page">
      <div v-for="section in mappedSections" :key="section.id">
        <slot name="section" :section="section">
          <component
            v-if="section.contentType"
            :is="section.contentType"
            :id="section.handle"
            v-bind="section.data"
          />
        </slot>
      </div>
    </slot>
    <slot name="body" :body="body">
      <div class="page-content-body section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-8 content" v-html="body" />
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import { BLOCKS } from '@contentful/rich-text-types'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import HeroBanner from '~/components/nacelle/ContentHeroBanner'
import SideBySide from '~/components/nacelle/ContentSideBySide'
import Testimonials from '~/components/nacelle/ContentTestimonials'
import Testimonial from '~/components/nacelle/ContentTestimonial'
import ProductGrid from '~/components/nacelle/ContentProductGrid'

export default {
  components: {
    HeroBanner,
    SideBySide,
    Testimonials,
    Testimonial,
    ProductGrid
  },
  props: {
    page: {
      type: Object,
      default: () => ({
        source: '',
        sections: []
      })
    },
    products: {
      type: Array,
      default: () => []
    },
    customContentToHtml: {
      type: Boolean,
      default: false
    },
    contentToHtmlFn: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    contentToHtml () {
      if (this.customContentToHtml) {
        return this.contentToHtmlFn
      }

      return this.defaultContentToHtml
    },
    mappedSections () {
      if (this.page && this.page.sections && this.page.sections.length > 0) {
        const { source, sections } = this.page
        if (source === 'contentful') {
          return sections.map(this.mapSection)
        }

        if (source === 'shopify') {
          return this.reduceShopifySections(sections).map(
            this.mapSection
          )
        }

        return sections
      }

      return []
    },
    body () {
      if (this.page) {
        const { source } = this.page

        if (source === 'shopify' && this.page.content) {
          return this.page.content
        }

        if (
          source === 'contentful' &&
          this.page.fields &&
          this.page.fields.body
        ) {
          return this.contentToHtml(this.page.fields.body)
        }
      }

      return ''
    }
  },
  methods: {
    getImgSrc (img) {
      // extract url from Contentful or Shopify image object
      if (!img) { return '' }
      const { originalSrc, fields } = img
      let src = fields && fields.file.url
      if (originalSrc) {
        src = originalSrc
      }
      return src || ''
    },
    getContentType (section) {
      return section 
        && section.sys
        && section.sys.contentType.sys.id 
        || section.contentType
        && section.contentType.replace('Content', '')
    },
    defaultContentToHtml (content) {
      const options = {
        renderNode: {
          [BLOCKS.EMBEDDED_ASSET]: node => `
            <img class="post-image" src="${node.data.target.fields.file.url}" alt="${node.data.target.fields.title}" />
          `
        }
      }

      return documentToHtmlString(content, options)
    },
    reduceShopifySections (sections) {
      return sections.reduce((sections, section, index) => {
        if (index > 0 && section.tags.includes('childSection')) {
          const parent = sections[sections.length - 1]
          const child = this.mapSection(section)

          if (parent.children) {
            parent.children.push(child)
          } else {
            parent.children = [child]
          }
        } else {
          section.fields = { ...section }
          sections.push(section)
        }

        return sections
      }, [])
    },

    mapSection (section) {
      // extract the contentType
      const contentType = this.getContentType(section)

      // map fields
      let data = {}
      const keys = Object.keys(section.fields)

      // reverse loop for performance
      for (let i = keys.length; i--;) {
        const key = keys[i]
        data[key] = section.fields[key]

        switch (key) {
          // case fallthrough for duplicated actions
          case 'mobileFullHeight':
          case 'reverseDesktop':
          case 'reverseMobile':
            data[key] = `${data[key]}` == 'true'
            break;
          case 'ctaUrl':
            data.ctaHandler = () => { this.$router.push(data[key]) }
            break;
          case 'columns':
            data[key] = parseInt(data[key], 10) || 4
            break;
          case 'image':
          case 'featuredMedia':
            data.imageUrl = this.getImgSrc(data[key])
            break;
          case 'mobileBackgroundImage':
            data.mobileBackgroundImgUrl = this.getImgSrc(data[key])
            break;
          case 'content':
            data.contentHtml = this.contentToHtml(data[key]) || ''
            break;
          case 'slides':
            data[key] = data[key].map(({
                fields: { name, quotation, featuredMedia }
              }) => ({
                name,
                quote: quotation,
                imageUrl: this.getImgSrc(featuredMedia)
              }))
            break;
          case 'children':
            data.slides = data[key].map(({
                data: { title, contentHtml, image }
              }) => ({
                name: title,
                quote: contentHtml,
                imageUrl: this.getImgSrc(image)
              }))
            break;
        }
      }

      if (contentType.toLowerCase().includes('productgrid')) {
        data.products = this.products
      }

      return {
        handle: section.fields.handle,
        contentType,
        data
      }
    }
  }
}
</script>

<style></style>
