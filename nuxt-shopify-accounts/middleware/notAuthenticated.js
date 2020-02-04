export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
  console.log('store', store.state)
  if (store.state.account.customerAccessToken) {
    return redirect('/account')
  }
}
