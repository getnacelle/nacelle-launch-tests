import { shallowMount, createLocalVue } from '@vue/test-utils'
import ProductAddToWishlistButton from '@/components/nacelle/ProductAddToWishlistButton'
import createStoreConfig from '../storeConfig'
import Vuex from 'vuex'

describe('Product Add to Wishlist Button', () => {
  it('renders the button', async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const storeConfig = createStoreConfig()
    const store = new Vuex.Store(storeConfig)
    const variant = {
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yODU2ODgyMDAyMzQwMQ==',
      price: '29.99',
      availableForSale: true
    }
    const wrapper = shallowMount(ProductAddToWishlistButton, {
      localVue,
      store,
      propsData: {
        product: {
          priceRange: {
            min: '10.99',
            max: '29.99'
          },
          title: 'Awesome T-Shirt',
          category: "Men's Shirts",
          featuredMedia: {
            src: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg',
            thumbnailSrc:
              'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg'
          },
          description:
            "<p>This is the t-shirt description. It's a really nice item, isn't it? You can buy it in different colors and sizes.</p>",
          id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM1OTkyMDE4NjE3Mzc=',
          handle: 'gray-t-shirt',
          availableForSale: true,
          variants: [variant],
          options: [
            {
              name: 'Size',
              values: ['xs', 's']
            }
          ]
        },
        variant
      }
    })
    expect(wrapper.findAll('.add-to-wishlist').exists()).toBe(true)
  })

  it('adds the item to wishlist', async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const storeConfig = createStoreConfig()
    const store = new Vuex.Store(storeConfig)
    const variant = {
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFadC8yODU2ODgyMDAyMzQwMQ==',
      price: '29.99',
      availableForSale: true,
      selectedOptions: [
        {
          name: 'Size',
          value: 'Small'
        }
      ]
    }
    const wrapper = shallowMount(ProductAddToWishlistButton, {
      localVue,
      store,
      propsData: {
        allOptionsSelected: true,
        variant,
        product: {
          priceRange: {
            min: '10.99',
            max: '29.99'
          },
          title: 'Awesome T-Shirt',
          category: "Men's Shirts",
          featuredMedia: {
            src: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg',
            thumbnailSrc:
              'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg'
          },
          description:
            "<p>This is the t-shirt description. It's a really nice item, isn't it? You can buy it in different colors and sizes.</p>",
          id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM1OTkyMDE4NjE3Mzc=',
          handle: 'gray-t-shirt',
          availableForSale: true,
          variants: [variant],
          options: [
            {
              name: 'Size',
              values: ['Small']
            }
          ]
        }
      }
    })
    wrapper.find('.add-to-wishlist').trigger('click')
    expect(store.state.wishlist.items.length).toBeGreaterThan(0)
  })

  it('removes the item from wishlist', async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const storeConfig = createStoreConfig()
    const store = new Vuex.Store(storeConfig)
    const variant = {
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFadC8yODU2ODgyMDAyMzQwMQ==',
      price: '29.99',
      availableForSale: true,
      selectedOptions: [
        {
          name: 'Size',
          value: 'Small'
        }
      ]
    }
    const product = {
      priceRange: {
        min: '10.99',
        max: '29.99'
      },
      title: 'Awesome T-Shirt',
      category: "Men's Shirts",
      featuredMedia: {
        src: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg',
        thumbnailSrc:
          'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg'
      },
      description:
        "<p>This is the t-shirt description. It's a really nice item, isn't it? You can buy it in different colors and sizes.</p>",
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM1OTkyMDE4NjE3Mzc=',
      handle: 'gray-t-shirt',
      availableForSale: true,
      variants: [variant],
      options: [
        {
          name: 'Size',
          values: ['Small']
        }
      ]
    }
    const wrapper = shallowMount(ProductAddToWishlistButton, {
      localVue,
      store,
      propsData: {
        allOptionsSelected: true,
        variant,
        product
      }
    })

    store.state.wishlist.items = [
      {
        product,
        variant
      }
    ]
    wrapper.find('.add-to-wishlist').trigger('click')
    expect(store.state.wishlist.items.length).toBe(0)
  })

  it('has class "not-saved" when item is not added', async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const storeConfig = createStoreConfig()
    const store = new Vuex.Store(storeConfig)
    const variant = {
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFadC8yODU2ODgyMDAyMzQwMQ==',
      price: '29.99',
      availableForSale: true,
      selectedOptions: [
        {
          name: 'Size',
          value: 'Small'
        }
      ]
    }
    const wrapper = shallowMount(ProductAddToWishlistButton, {
      localVue,
      store,
      propsData: {
        allOptionsSelected: true,
        onlyOneOption: true,
        variant,
        product: {
          priceRange: {
            min: '10.99',
            max: '29.99'
          },
          title: 'Awesome T-Shirt',
          category: "Men's Shirts",
          featuredMedia: {
            src: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg',
            thumbnailSrc:
              'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg'
          },
          description:
            "<p>This is the t-shirt description. It's a really nice item, isn't it? You can buy it in different colors and sizes.</p>",
          id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM1OTkyMDE4NjE3Mzc=',
          handle: 'gray-t-shirt',
          availableForSale: true,
          variants: [variant],
          options: [
            {
              name: 'Size',
              values: ['Small']
            }
          ]
        }
      }
    })
    expect(wrapper.find('.add-to-wishlist').classes('not-saved')).toBe(true)
  })

  it('has class "saved" when item is added', async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const storeConfig = createStoreConfig()
    const store = new Vuex.Store(storeConfig)
    const variant = {
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFadC8yODU2ODgyMDAyMzQwMQ==',
      price: '29.99',
      availableForSale: true,
      selectedOptions: [
        {
          name: 'Size',
          value: 'Small'
        }
      ]
    }
    const product = {
      priceRange: {
        min: '10.99',
        max: '29.99'
      },
      title: 'Awesome T-Shirt',
      category: "Men's Shirts",
      featuredMedia: {
        src: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg',
        thumbnailSrc:
          'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg'
      },
      description:
        "<p>This is the t-shirt description. It's a really nice item, isn't it? You can buy it in different colors and sizes.</p>",
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM1OTkyMDE4NjE3Mzc=',
      handle: 'gray-t-shirt',
      availableForSale: true,
      variants: [variant],
      options: [
        {
          name: 'Size',
          values: ['Small']
        }
      ]
    }
    store.state.wishlist.items = [
      {
        product,
        variant
      }
    ]
    const wrapper = shallowMount(ProductAddToWishlistButton, {
      localVue,
      store,
      propsData: {
        allOptionsSelected: true,
        onlyOneOption: true,
        variant,
        product
      }
    })
    expect(wrapper.find('.add-to-wishlist').classes('saved')).toBe(true)
  })
})
