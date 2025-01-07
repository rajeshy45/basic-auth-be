import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-openidconnect';

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  constructor() {
    super({
      issuer: process.env.OIDC_ISSUER,
      authorizationURL: process.env.OIDC_AUTHORIZATION_URL,
      tokenURL: process.env.OIDC_TOKEN_URL,
      userInfoURL: process.env.OIDC_USER_INFO_URL,
      clientID: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      callbackURL: process.env.OIDC_CALLBACK_URL,
      scope: 'openid profile email',
    });
  }

  async validate(issuer: string, profile: any, done: Function) {
    console.log({ issuer, profile });
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
    };
    done(null, user);
  }
}
