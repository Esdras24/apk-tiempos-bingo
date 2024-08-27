import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { InfoComponent } from '../../info/info.component';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appVersion } from 'src/app/shared/constants';
import { BancaInterface } from 'src/app/interfaces/local-interface.module';
import { catchError, map, Observable, Subscription, throwError } from 'rxjs';
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
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
    this.subscription.add(
      this.authService
        .login(this.authFormGroup.value)
        .pipe(
          map(async (data) => {
            switch (data.estado) {
              case 'm': {
                if (data?.messages?.length) {
                  await this.openModal(data.messages, 'mensaje');
                }
                this.authService.setUser(data);
                this.router.navigate(['/app/sell']);
                break;
              }
              case 'Estas inactivo en nuestra plataforma': {
                const toast = await this.toastController.create({
                  message: 'Estas inactivo en nuestra plataforma',
                  duration: 2000,
                });
                toast.present();
                break;
              }
              case 'update': {
                await this.openModal(
                  [
                    {
                      message:
                        'Necesitas Actualizar la aplicacion, Contacta a servicio al cliente',
                    },
                  ],
                  'update'
                );
                break;
              }
              case 'Contrasena Erronea': {
                const toast = await this.toastController.create({
                  message: 'Contraseña Erronea',
                  duration: 2000,
                });
                toast.present();
                break;
              }
              default: {
                const toast = await this.toastController.create({
                  message: 'No tienes permiso de ingresar',
                  duration: 2000,
                });
                toast.present();
                break;
              }
            }
          }),
          catchError((errors: HttpErrorResponse) => {
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
            this.bancaInfo = res;
            this.authService.setBancaData(res); 
          }),
          catchError((error: HttpErrorResponse) => {
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
