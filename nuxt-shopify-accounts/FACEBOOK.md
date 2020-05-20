# Facebook

###### Setup up a Facebook App for Social Login

---

### Summary

The goal is provide simple instructions for setting up an app on the [Facebook developers portal](https://developers.facebook.com/).

We will address:

1. [Basic Setup](#basic-setup)
2. [Environments](#environments)
3. [Roles](#roles)

---

### Basic Setup

1. Log in to https://developers.facebook.com/
2. Click **Create App** button
3. Choose a good `Display Name` (Remember customers will see this when they login for the first time. Just the store name is a good practice to build trust.)
4. Go to **Settings > Basic**
5. Copy `App ID` to your `.env` file:
    - `FACEBOOK_APP_ID="xxxxxx"`
6. Copy `App Secret` to your `.env` file:
    - `FACEBOOK_APP_SECRET="xxxxxx"`
7. Click **Products (+)**
8. Click **Setup** for **Facebook Login**
9. Skip the **Quickstart** and go straight to **Facebook Login > Settings**.
10. Add `Valid OAuth Redirect URIs`:
    - ie. `https://example.com/api/auth/facebook/callback`
        - **NOTE**: You may need to add more than one depending on the number of environments you are supporting.
        - **NOTE**: By default anything localhost is supported for development.

### Environments

At the top bar of the Facebook Developer Dashboard you will see your **App ID** followed by an environment toggle switch.
  - This will read either `In development` or `Live`.

Best practices suggest creating a two apps, one for Production and one for Development. See notes and what is need to support both environments.

##### Production | `Live`

- Before being able to set this app to `Live`, a `Privacy Policy URL` must be set under **Settings > Basic**.
- Another way to build trust is to add an `App Icon` that represents your shop. This can be set under **Settings > Basic**. 
- **NOTE**: `localhost` will not act as a valid redirect while the application is `Live`.


##### Development | `In development`

- **NOTE**: While the app is `In development`, your data access will be limited to test users and other users who have a role on the app. See **Roles** below for more information.

### Roles

Roles will be important for managing the application as well as providing access to developers and testers. To read more please see [Facebook's documentation](https://developers.facebook.com/docs/apps/#development-mode).


To manage roles go to **Roles > Roles**.

##### Administrators | [Learn More](https://developers.facebook.com/docs/apps/security#admin)

Administrators have complete access to an app. Only account owners should be given this role in the Production version of the app.

##### Developers | [Learn More](https://developers.facebook.com/docs/apps/security#developer)

It may be good to give long term code maintainers this role.

##### Tester | [Learn More](https://developers.facebook.com/docs/apps/security#tester)

Anyone who may need to do regular testing, but who is not necessarily a developer should be given the role of a tester.


##### Test User | [Learn More](https://developers.facebook.com/docs/apps/test-users/)

Create a Test User to make a temporary facebook account for someone to use in order to access login for the development application. This is great for temporary testers or developers looking to utilize this feature during development or staging that may not be a part of the permanent team.

**NOTE**: A great use of this would be to create a Test User and add their credentials to the `readme.md` of a project so any developer can have access to utilize social login from the storefront if they need.