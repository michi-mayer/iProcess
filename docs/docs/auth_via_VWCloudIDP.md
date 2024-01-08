# About

VW [Cloud IDP](https://volkswagen-net.de/wikis/display/ACDC/CloudIDP+-+Developer+Help) (Identity Provider) is the authentication provider from Volkswagen. It provides authentication and is usable via OAuth 2.0 and OpenID Connect.

# Cloud IDP and Cognito

iProcess is relying on AWS Cognito for user and identity pools. In order to use the resources of VW Cloud IDP in iProcess, it has to be connected to AWS Cognito as a Federated Identity Provider via OpenID Connect.

## Adding a Federated Identity Provider

1. Go to [AWS Cognito](https://eu-west-1.console.aws.amazon.com/cognito/users/?region=eu-west-1#/?_k=gurq0i)
2. Select the User Pool you want to edit
3. Go to Federation --> Identity Providers --> OpenID Connect --> Create Provider
4. Provide the following parameters which you get from the administrator of the VW Cloud IDP instance: Client ID, Client Secret
5. Set Request Method to 'POST'
6. Set Authorize Scope to 'openid'
7. Set Issuer to https://idp.cloud.vwgroup.com/auth/realms/kums
8. Set Authorization endpoint to https://idp.cloud.vwgroup.com/auth/realms/kums/protocol/openid-connect/auth
9. Set Token endpoint to https://idp.cloud.vwgroup.com/auth/realms/kums/protocol/openid-connect/token
10. Set Userinfo endpoint to https://idp.cloud.vwgroup.com/auth/realms/kums/protocol/openid-connect/userinfo
11. Set JWKS URI to https://idp.cloud.vwgroup.com/auth/realms/kums/protocol/openid-connect/certs
12. Save

## Use the Federated Identity Provider in the Authentication Client

1. Go to App Integration --> App Client Settings
2. At 'Enabled Identity Providers' select 'Cognito User Pool' and your new Identity Provider
3. Provide Callback URL and Sign out URL, which should be the URLs to the iProcess application. For testing purposes, it could also be http://localhost:PortNumber
4. Set 'Allowed OAuth Flows' to 'Authorization code grant' and 'Implicit grant'
5. Set 'Allowed OAuth Scopes' to 'email', 'openid' and 'profile'
6. Save

## Create Amazon Cognito Domain

1. Go to App Integration --> Domain Name
2. Set a Domain Name
3. Save

# Federated Identity Provider in an Amplify App

AWS Amplify provides an [Authenticator](https://ui.docs.amplify.aws/react/connected-components/authenticator) UI component which includes a Context for authentication state and an Auth client.

## Import Authenticator UI and Auth client

```js
import { Authenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'.
```

## Configure Auth

```js
export const authConfig = {
region: [Your AWS Region],
userPoolId: [Your Cognitor User Pool ID],
userPoolWebClientId: [Your Cognito Web Client ID],
oauth: {
domain: [Your OAuth Domain],
scope: ['email', 'openid', 'profile'],
redirectSignIn: [Your Application URL],
redirectSignOut: [Your Application URL],
responseType: 'code'
}
}
```

You can find the needed parameters within the AWS Console, including:

- [Your Cognito Web Client ID](Use-the-Federated-Identity-Provider-in-the-Authentication-Client)
- [Your OAuth Domain](Create-Amazon-Cognito-Domain)

Ideally the authConfig parameters are provided via env variables.

# Implementation

The implementation can be found in the following files:

- src/App.tsx - For the Authenticator component
- src/contexts/authContext.tsx - Provides global auth state
- src/components/Login.tsx - Login via Amplify UI
- src/lib/ui/Buttons.tsx - Using the signout function from Amplify
