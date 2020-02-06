export const state = () => ({
  collectionLimit: 12
})

export const mutations = {}

export const actions = {
  nuxtServerInit(ctx, context) {
    let customerAccessToken = null
    if (context.app && context.app.$cookies) {
      const accessToken = context.app.$cookies.get('customerAccessToken')
      if (accessToken) {
        customerAccessToken = {
          accessToken,
          expiresAt: null
        }
      }
    }
    
    ctx.commit('account/setCustomerAccessToken', customerAccessToken)
    this.$nacelle.nacelleNuxtServerInit(ctx, context)
  }
}
