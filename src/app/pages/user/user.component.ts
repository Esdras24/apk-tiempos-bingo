import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserDataEntity } from 'src/app/interfaces/user-data-model.module';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { UserService } from './user.service';
import { FolderService } from '../folder/folder.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public user: UserEntity;
  public userInfo: UserDataEntity = {
    sinpeUser: '',
    sinpeBanca: '',
    acountUser: '',
    nameBanca: '',
  };
  constructor(
    private userService: UserService,
    private toastController: ToastController,
    private folderService: FolderService
  ) {}

  ngOnInit() {
    this.user = this.userService.getUser();

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
    (await this.folderService.getUserInfo()).subscribe(
      async (result) => {
        this.user.saldo = parseInt(result.monedero).toLocaleString('es-MX');
        this.user.bonus = parseInt(result.bonus).toLocaleString('es-MX');

        await this.folderService.setUser(this.user);
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
  };
}
