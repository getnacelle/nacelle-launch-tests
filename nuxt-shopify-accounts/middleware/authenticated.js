export default function ({ store, redirect }) {
  // If the user is not authenticated
  // const { account } = store.state
  const {
    customerAccessToken
  } = store.state.account

  if (
    !customerAccessToken
  ) {
    return redirect('/account/login')
  }
}