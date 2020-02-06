export default function (ctx) {
  const { store, redirect, app } = ctx
  // If the user is not authenticated
  const customerAccessToken = app.$cookies.get('customerAccessToken')

  if (customerAccessToken === undefined || customerAccessToken === false) {
    console.log('not authenticated')
    return redirect('/account/login')
  }
}