export default function ({ store, redirect, app }) {
  // If the user is authenticated redirect to account
  const customerAccessToken = app.$cookies.get('customerAccessToken')
  
  if (customerAccessToken) {
    console.log('already logged in')
    return redirect('/account')
  }
}
