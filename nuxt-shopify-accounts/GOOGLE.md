# Google

###### Setup up a Google App for Social Login

---

### Summary

The goal is provide simple instructions for setting up an app on the [Google developers portal](https://developers.google.com/).

We will address:

1. [Basic Setup](#basic-setup)

---

### Basic Setup

1. Log in to https://console.developers.google.com/
2. Click **New Project** button from project dropdown.
3. Choose a good `Project Name`
4. Go to **OAuth consent screen**
    - Select `External` and then click `Create`
    - Fill out:
        - Application Type
            - Set to `Public`
        - Application Name
            - (Remember customers will see this when they login for the first time. Just the store name is a good practice to build trust.)
        - Application Logo
            - Helps to build trust.
        - Support Email
        - Scopes should include [(?)](https://developers.google.com/identity/protocols/oauth2/scopes) (`email`, `profile`, and `openid`)
        - Authorized Domains [(?)](https://support.google.com/cloud/answer/6158849#authorized-domains)
            - Should include netlify staging domains (ie. `romantic-babbage-69c703.netlify.app`)
        - Application Homepage link
        - Application Privacy Policy link

5. Go to **Credentials** and click **+ CREATE CREDENTIALS > OAuth client ID**.
    - Select **Application type** of `Web Application`
    - Add **Javascript origins**
        - ie. `https://romantic-babbage-69c703.netlify.app` and/or your production url.
    - Add **Authorized redirect URIs**
        - Development: `http://localhost:8888/.netlify/functions/auth/google/callback`
        - Dev Static Build: `http://localhost:8888/api/auth/google/callback`
        - Staging: `https://romantic-babbage-69c703.netlify.app/api/auth/google/callback`
        - Production: make sure to add your production url as well appended with `/api/auth/google/callback`
6. Copy `Client ID` to your `.env` file:
    - `GOOGLE_CLIENT_ID="xxxxxx"`
7. Copy `Client Secret` to your `.env` file:
    - `GOOGLE_CLIENT_SECRET="xxxxxx"`
8. Go back to **OAuth consent screen**
    - Click **prepare your app** so we can verify.
    - At the bottom click **Submit for Verification**
    - Add Scope justification (ie. Authorize customers to securely create accounts and login into our storefront to manage their e-commerce experience.) and Contact email address.
    - Learn more about verification [here](https://support.google.com/cloud/answer/7454865)