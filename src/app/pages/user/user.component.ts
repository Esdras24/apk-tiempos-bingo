import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserDataEntity } from 'src/app/interfaces/user-data-model.module';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { UserService } from './user.service';
import { FolderService } from '../folder/folder.service';
import { catchError, map, Subscription, throwError } from 'rxjs';
import { BancaInterface } from 'src/app/interfaces/local-interface.module';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public user!: UserEntity;
  public userInfo: UserDataEntity = {
    sinpeUser: '',
    sinpeBanca: '',
    acountUser: '',
    nameBanca: '',
  };
  bancaInfo!: BancaInterface;
  subscription = new Subscription();
  loading = false;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastController: ToastController,
    private folderService: FolderService
  ) {}

  ngOnInit() {
    this.user = this.userService.getUser();
    this.getAppInfo();

    this.userService.getUserInfo(this.user.userName).subscribe(
      (result) => {
        this.userInfo = {
          sinpeUser: result.sinpe,
          sinpeBanca: result.tel,
          acountUser: result.cuenta,
          nameBanca: result.nombreSinpe,
        };
      },
      async (error) => {
        console.log(error);
        const toast = await this.toastController.create({
          message: 'Error cargando la informacaion de usuario',
          duration: 2000,
        });
        toast.present();
      }
    );

    this.getUserInfo();
  }

  getUserInfo = async () => {
    this.loading = true;
    (await this.folderService.getUserInfo()).subscribe(
      async (result) => {
        this.user.saldo = parseInt(result.monedero).toLocaleString('es-MX');
        this.user.bonus = parseInt(result.bonus).toLocaleString('es-MX');

        await this.folderService.setUser(this.user);
        this.loading = false;
      },
      async (error) => {
        this.loading = false;
        console.log(error);
        const toast = await this.toastController.create({
          message: 'Error cargando la informacaion de usuario',
          duration: 2000,
        });
        toast.present();
      }
    );
  };

  sendWhatsappRequest() {
    const urlWhatsapp =
      'https://wa.me/+506' +
      this.bancaInfo.whatsapp +
      "?text='Buenas me pueden ayudar con...'";
    window.open(urlWhatsapp);
  }

  getAppInfo() {
    this.bancaInfo = this.authService.getBancaInfo();
  }
}
