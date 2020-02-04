export default function ({ store, redirect }) {
  // If the user is not authenticated
  console.log('store', store)
  if (!store.state.account.customerAccessToken) {
    return redirect('/account/login')
  }
}