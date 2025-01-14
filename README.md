
# Basic Auth Backend

This project is a backend application built with NestJS that supports basic authentication and OpenID Connect (OIDC) authentication using Google as the OIDC provider.

## Features

- User registration and login
- JWT-based authentication
- OpenID Connect (OIDC) authentication with Google
- Session management

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/rajeshy45/basic-auth-be.git
   cd basic-auth-be
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a **.env** file in the root directory and add the following environment variables:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=firewall
   DB_USER=admin
   DB_PASS=admin
   
   BCRYPT_SALT_ROUNDS=10
   
   JWT_SECRET=a_strong_secret

   OIDC_ISSUER=https://accounts.google.com
   OIDC_AUTHORIZATION_URL=https://accounts.google.com/o/oauth2/v2/auth
   OIDC_TOKEN_URL=https://oauth2.googleapis.com/token
   OIDC_USER_INFO_URL=https://openidconnect.googleapis.com/v1/userinfo
   OIDC_CLIENT_ID=your-google-client-id
   OIDC_CLIENT_SECRET=your-google-client-secret
   OIDC_CALLBACK_URL=http://localhost:3000/auth/oidc/callback
   ```

4. Start the application:

   ```sh
   npm run start
   ```

## Usage

### Endpoints

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login with email and password
- `GET /auth/oidc`: Initiate OIDC login with Google
- `GET /auth/oidc/callback`: OIDC callback endpoint
- `GET /auth/logout`: Logout the user

### Example Requests

#### Register

```sh
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email": "testuser@test.com", "password": "testpass"}'
```

#### Login

```sh
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email": "testuser@test.com", "password": "testpass"}'
```

## License

This project is licensed under the MIT License.

Make sure to replace `your-google-client-id` and `your-google-client-secret` with your actual Google OAuth 2.0 credentials. You can also customize the README further based on your project's specific requirements and features.
