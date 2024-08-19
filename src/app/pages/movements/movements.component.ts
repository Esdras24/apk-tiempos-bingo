import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { SortType } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { FolderService } from '../folder/folder.service';
import { MovementsService } from './movements.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss'],
})
export class MovementsComponent implements OnInit {
  public showDateTime = false;
  public date = '';
  public columns: any;
  public rows = [];
  public user: UserEntity;
  public SortType = SortType;
  public dateGroup = new FormGroup({
    date: new FormControl(),
  });

  public moveGroup = new FormGroup({
    rechargeRequest: new FormControl(null),
    depositRequest: new FormControl(null),
  });

  constructor(
    private movementService: MovementsService,
    private folderService: FolderService,
    private toastController: ToastController
  ) {
    this.columns = [{ name: 'Tipo' }, { name: 'Detalle' }, { name: 'Balance' }];
  }

  dateChange() {
    this.date = moment(this.dateGroup.controls.date.value).format('DD-MM-YYYY');
    this.showDateTime = !this.showDateTime;
    this.getList();
  }

  getList() {
    const dateToSend = this.dateGroup.controls.date.value
      ? this.dateGroup.controls.date.value
      : new Date();
    this.movementService
      .getList(moment(dateToSend).format('YYYY-MM-DD'))
      .subscribe(
        (result) => {
          this.rows = result.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  depositRequest() {
    if (this.moveGroup.controls.depositRequest.value) {
      this.movementService
        .depositRequest(`${this.moveGroup.controls.depositRequest.value}`)
        .subscribe(
          (result) => {},
          async (error) => {
            this.toastController
              .create({
                message: error.error.text,
                duration: 2000,
              })
              .then((data: any): void => {
                data.present();
              });
            this.moveGroup.controls.depositRequest.setValue(null);
            this.getList();

            if (error.error.text === 'Solicitud Hecha Con Exito') {
              // se actualiza el saldo//
              (await this.folderService.getUserInfo()).subscribe(
                async (result) => {
                  this.user.saldo = parseInt(result.monedero).toLocaleString(
                    'es-MX'
                  );
                  this.user.bonus = parseInt(result.bonus).toLocaleString(
                    'es-MX'
                  );

                  await this.folderService.setUser(this.user);
                },
                async (error) => {
                  console.log(error);
                  const toast = await this.toastController.create({
                    message: 'Error cargando la informacion de usuario',
                    duration: 2000,
                  });
                  toast.present();
                }
              );
            }
          }
        );
    } else {
      this.toastController
        .create({
          message: 'Debe de colocar un numero',
          duration: 2000,
        })
        .then((data: any): void => {
          data.present();
        });
    }
  }

  rechargeRequest() {
    if (this.moveGroup.controls.rechargeRequest.value) {
      this.movementService
        .rechargeRequest(`${this.moveGroup.controls.rechargeRequest.value}`)
        .subscribe(
          (result) => {},
          (error) => {
            if (error.error.text === 'Solcicitud Hecha Con Exito') {
              this.toastController
                .create({
                  message: 'Solicitud Hecha Con Exito',
                  duration: 2000,
                })
                .then((data: any): void => {
                  data.present();
                });
              this.moveGroup.controls.depositRequest.setValue(null);
            } else {
              this.toastController
                .create({
                  message: 'Hubo un problema revise los movimientos',
                  duration: 2000,
                })
                .then((data: any): void => {
                  data.present();
                });
            }
            this.getList();
          }
        );
    } else {
      this.toastController
        .create({
          message: 'Debe de colocar un monto',
          duration: 2000,
        })
        .then((data: any): void => {
          data.present();
        });
    }
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
  
  ngOnInit() {
    const appDate = new Date();
    this.date = moment(appDate).format('DD-MM-YYYY');
    this.getList();
    this.user = this.movementService.getUser();
  }
}
