import React, { useState, useEffect, useContext } from 'react';
import { AccountContext } from 'providers/Account';
import Link from 'next/link';

const NacellePassport = () => {
  const [init, setInit] = useState(false);
  const { accountData, accountDispatcher } = useContext(AccountContext);

  useEffect(() => {
    if (!init) {
      setInit(true);
      accountDispatcher({
        type: 'INIT_PASSPORT'
      });
    }
  }, [init, accountDispatcher]);
  const handleClick = () => {
    fetch(
      `http://localhost:4000/api/auth/facebook?returnTo=http%3A%2F%2Flocalhost%3A4000%2Faccount%2Flogin`,
      {
        method: 'GET'
      }
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <Link href="/api/accounts/auth/facebook?returnTo=http%3A%2F%2Flocalhost%3A4000%2Faccount%2Flogin">
        <a>Login with Facebook</a>
      </Link>
      <br />
      <Link href={accountData.google}>
        <a>Login with Google</a>
      </Link>
    </div>
  );
};

export default NacellePassport;

//   created() {
//     this.endpoint =
//       process.env.NODE_ENV === `development` ? `/.netlify/functions` : `/api`
//   },
//   async mounted() {
//     this.facebook.url = this.authUrl('facebook')
//     this.google.url = this.authUrl('google')

//     const ncl = await this.$cookies.get('ncl')
//     if (ncl) {
//       try {
//         // eslint-disable-next-line no-unused-vars
//         const { email, jwt, strategy, accessToken, expiresAt } = ncl
//         await axios.get(`${this.endpoint}/auth/status`, {
//           withCredentials: true
//         })
//         this[strategy].text = this[strategy].text.replace('Login', 'Logged')
//         this[strategy].url = '#'
//         if (accessToken) {
//           await this.$store.dispatch(
//             'account/renewCustomerAccessToken',
//             accessToken
//           )
//           this.$router.push('/account')
//         }
//       } catch (error) {
//         console.error('error', error)
//         this.$cookies.remove('ncl_email')
//         this.$cookies.remove('ncl_strategy')
//       }
//     }
//   },
//   methods: {
//     authUrl(strategy) {
//       if (process.browser) {
//         return `${this.endpoint}/auth/${strategy}?returnTo=${encodeURIComponent(
//           window.location.href
//         )}`
//       } else {
//         return '/'
//       }
//     }
//   }
// }
