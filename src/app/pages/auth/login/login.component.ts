import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { InfoComponent } from '../../info/info.component';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  authFormGroup!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  async openModal(info: any, type: string) {
    const modal = await this.modalController.create({
      component: InfoComponent,
      componentProps: { info, type },
    });
    modal.present();
  }

  onSubmit() {
    this.authService.login(this.authFormGroup.value).subscribe(
      async (data) => {
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
      },
      (errors) => {
        console.log(errors);
        alert(errors);
      }
    );
  }

  ngOnInit() {
    this.authFormGroup = new FormGroup({
      userID: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    const user: UserEntity = {
      userName: '',
    };
    this.authService.setUser(user);
  }
}
