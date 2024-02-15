## SSO in Angular Applications

To enable **Single Sign-On (SSO)** in an Angular application within a Windows domain or Active Directory (AD) environment, you can follow these steps:

1. Register Your Application:
   - Register your Angular app in the **Microsoft Azure portal** or **Microsoft 365 admin center**. This step involves creating an application registration and obtaining a **client ID**.
   - Record the **tenant ID**, which corresponds to your Azure AD tenant.

2. Use MSAL for Angular:
   - **MSAL (Microsoft Authentication Library) for Angular** is a powerful library that facilitates authentication with Azure AD and Microsoft identity platform.
   - Install the `@azure/msal-angular` package in your Angular project using npm or yarn.

3. Configure Authentication:
   - In your Angular app, configure the MSAL module by providing the necessary parameters:
     - `tenant`: Your Azure AD tenant ID.
     - `clientId`: The client ID obtained during app registration.
     - `redirectUri`: The URL where users are redirected after signing in.
     - `navigateToLoginRequestUrl`: Set to `false` to prevent automatic navigation to the login request URL.
     - `cacheLocation`: Choose between `localStorage` or `sessionStorage` for token caching.

4. Implement SSO Flow:
   - Use the **authorization code flow with PKCE (Proof Key for Code Exchange)**. This flow ensures secure authentication and token exchange.
   - When a user signs in, your Angular app will obtain an **access token** from Azure AD.
   - Include this token in the **authorization header** of your HTTP requests to call APIs (such as Microsoft Graph).

5. Test Your App:
   - Run your Angular app locally and test the SSO functionality.
   - Ensure that users are seamlessly authenticated using their Windows domain credentials.

Here are some resources to guide you further:

- [Tutorial: Create an Angular app using auth code flow with MSAL](https://learn.microsoft.com/en-us/entra/identity-platform/tutorial-v2-angular-auth-code)
- [Sample Angular app with Azure AD sign-in using MSAL](https://learn.microsoft.com/en-us/samples/azure-samples/ms-identity-ciam-javascript-tutorial/ms-identity-ciam-javascript-tutorial-2-sign-in-angular/)

