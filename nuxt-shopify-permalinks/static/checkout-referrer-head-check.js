function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Used in:
 * 
 * pages/checkout/create
 * --> referred from Checkout (page `show`)
 * 
 * pages/checkout/complete
 * --> referred from Checkout (page: `thank_you`)
 */

if (getParameterByName('token')) {
  // The "token" exist
} else {
  // The "token" do NOT exist
  window.location = '/'
}