export default function ({ store, redirect }) {
  // If the user is not authenticated
  const { customerAccessToken } = store.state.account
  if (
    !customerAccessToken ||
    new Date(customerAccessToken.expiresAt) < Date.now()
  ) {
    return redirect('/account/login')
  }
}