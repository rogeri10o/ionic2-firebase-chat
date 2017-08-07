import { HomePage } from './../home/home';
import { FirebaseAuthState } from 'angularfire2';
import { AuthService } from './../../providers/auth.service';
import { UserService } from './../../providers/user.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupForm: FormGroup;

  constructor(public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public authService: AuthService,
    public loadingCtrl: LoadingController) {

    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  onSubmit(): void {
    let loading: Loading = this.showLoading();
    let formUser = this.signupForm.value;
    let username: string = formUser.username;

    this.userService.userExists(username)
      .first()
      .subscribe((userExists: boolean) => {
        if (!userExists) {
          this.authService.createAuthUser({
            email: formUser.email,
            password: formUser.password
          }).then((authState: FirebaseAuthState) => {
            delete formUser.password;
            let uuid: string = authState.auth.uid;

            this.userService.create(formUser, uuid)
              .then(() => {
                console.log('Usuário cadstrado com sucesso!');
                this.navCtrl.setRoot(HomePage);
                loading.dismiss();
              }).catch((error: any) => {
                console.log('Erro ao criar usuário!', error);

                loading.dismiss();
                this.showAlert(error);
              });
          }).catch((error: any) => {
            console.log(error);
            loading.dismiss();
            this.showAlert(error);
          });

        } else {
          this.showAlert(`O username ${username} já está sendo usado em outra conta!`);
          loading.dismiss();
        }
      });
  }

  showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    return loading;
  }

  showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }
}
