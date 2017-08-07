import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import { AngularFireAuth, FirebaseAuthState } from "angularfire2";
import { BaseService } from "./base.service";

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService extends BaseService {

  constructor(public http: Http, public auth: AngularFireAuth) {
    super();
    console.log('Hello Auth Provider');
  }

  createAuthUser(user: {
    email: string, password: string
  }): firebase.Promise<FirebaseAuthState> {
    return this.auth.createUser(user)
      .catch(this.handlePromiseError);
  }

  signinWithEmail(user: {email: string, password: string}): firebase.Promise<boolean> {
    return this.auth.login(user)
      .then((authState: FirebaseAuthState) => {
        return authState != null;
      }).catch(this.handlePromiseError);
  }

  logout(): Promise<void> {
    console.log('logout realizado!');
    return this.auth.logout();
  }

  get autenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth.first().subscribe((authState: FirebaseAuthState) => {
          (authState) ? resolve(true) : reject(true);
        });
    });
  }
}
