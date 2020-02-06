const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => ({
  collectionLimit: 12
})

export const mutations = {}

export const actions = {
  nuxtServerInit(ctx, context) {
    let customerAccessToken = null
    if (context.req && context.req.headers.cookie) {
      const parsed = cookieparser.parse(context.req.headers.cookie)
      if (parsed.customerAccessToken) {
        customerAccessToken = {
          accessToken: parsed.customerAccessToken,
          expiresAt: null
        }
      }
    }
    
    ctx.commit('account/setCustomerAccessToken', customerAccessToken)
    this.$nacelle.nacelleNuxtServerInit(ctx, context)
  }
}
