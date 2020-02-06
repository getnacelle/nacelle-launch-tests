export default function ({ store, redirect }) {
  // If the user is authenticated redirect to account
  const {
    customerAccessToken
  } = store.state.account
  
  if (
    customerAccessToken
  ) {
    return redirect('/account')
  }
}
