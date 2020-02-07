if (document.cookie.split(';').filter((item) => item.trim().startsWith('customerAccessToken=')).length) {
  console.log('The cookie "customerAccessToken" exists')
} else {
  console.log('The cookie "customerAccessToken" does NOT exists', window.location = '/account/login')
}