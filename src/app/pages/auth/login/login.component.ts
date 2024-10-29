import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { InfoComponent } from '../../info/info.component';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appVersion } from 'src/app/shared/constants';
import { BancaInterface } from 'src/app/interfaces/local-interface.module';
import { catchError, map, Subscription, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  authFormGroup!: FormGroup;
  showPassword = false;
  appVersion = '';
  bancaInfo!: BancaInterface;
  subscription = new Subscription();
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loading = true;
    this.appVersion = appVersion;
    this.authFormGroup = new FormGroup({
      userID: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    const user: UserEntity = {
      userName: '',
    };
    this.authService.setUser(user);
    this.getAppInfo();
  }

  async openModal(info: any, type: string) {
    const modal = await this.modalController.create({
      component: InfoComponent,
      componentProps: { info, type },
    });
    modal.present();
  }

  onSubmit() {
    this.loading = true;
    this.subscription.add(
      this.authService
        .login(this.authFormGroup.value)
        .pipe(
          map(async (data) => {
            this.loading = false;
            if (data?.messages?.length) {
              await this.openModal(data.messages, 'mensaje');
            }
            this.authService.setUser(data);
            this.router.navigate(['/app/sell']);
          }),
          catchError(async (errors: HttpErrorResponse) => {
            const toast = await this.toastController.create({
              message: errors.error,
              duration: 2000,
              color: 'danger'
            });
            toast.present();
            this.loading = false;
            return throwError(() => errors);
          })
        )
        .subscribe()
    );
  }

  sendWhatsappRequest() {
    const urlWhatsapp =
      'https://wa.me/+506' +
      this.bancaInfo.whatsapp +
      "?text='Buenas me pueden ayudar con...'";
    window.open(urlWhatsapp);
  }

  getAppInfo() {
    this.subscription.add(
      this.authService
        .getAppInfo()
        .pipe(
          map((res: BancaInterface) => {
            this.loading = false;
            this.bancaInfo = res;
            this.authService.setBancaData(res); 
          }),
          catchError((error: HttpErrorResponse) => {
            this.loading = false;
            return throwError(() => error);
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
