import * as passport from 'passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PassportSetup {
  constructor() {
    passport.serializeUser((user: any, done: Function) => {
      done(null, user);
    });

    passport.deserializeUser((user: any, done: Function) => {
      done(null, user);
    });
  }
}
