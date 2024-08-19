import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { UserService } from '../user/user.service';
import { NotificacionsService } from './notificacions.service';
import { FolderService } from '../folder/folder.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public data: any;
  public user: UserEntity;
  constructor(
    private notificationsService: NotificacionsService,
    private userService: UserService,
    private folderService: FolderService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.user = this.userService.getUser();
    const date = new Date();
    this.getUserInfo();
    const date2 = moment(date).format('YYYY-MM-DD');
    let date1 = moment(date).subtract(3, 'days');
    this.notificationsService
      .getList(moment(date1).format('YYYY-MM-DD'), date2)
      .subscribe(
        (result) => {
          this.data = result.filter((e) => {
            if (e) {
              return e;
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
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
