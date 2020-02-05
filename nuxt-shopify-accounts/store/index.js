export const state = () => ({
  collectionLimit: 12
})

export const mutations = {}

export const actions = {
  async nuxtServerInit(ctx, context) {
    if (context && context.req &&  context.req.session && context.req.session.customerAccessToken) {
      await ctx.commit('account/setCustomerAccessToken', context.req.session.customerAccessToken)
    }
    await this.$nacelle.nacelleNuxtServerInit(ctx, context)
  }
}
