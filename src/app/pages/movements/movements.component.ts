import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SortType } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { FolderService } from '../folder/folder.service';
import { MovementsService } from './movements.service';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, map, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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
  public user!: UserEntity;
  public SortType = SortType;
  public dateGroup = new FormGroup({
    date: new FormControl(),
  });
  loading = false;
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
    this.loading = true;
    const dateToSend = this.dateGroup.controls.date.value
      ? this.dateGroup.controls.date.value
      : new Date();
    this.movementService
      .getList(moment(dateToSend).format('YYYY-MM-DD')).pipe(
        map(
          (result) => {
            this.loading = false;
            this.rows = result.data;
          }
        ),
        catchError(
          (error: HttpErrorResponse) => {
            this.loading = false;
            console.log(error);
            return throwError(()=>error);
          }
        )
      )
      .subscribe();
  }

  depositRequest() {
    this.loading = true;
    if (this.moveGroup.controls.depositRequest.value) {
      this.movementService
        .depositRequest(`${this.moveGroup.controls.depositRequest.value}`).pipe(
          map(
            (result) => {
              this.loading = false;
              this.toastController
                .create({
                  message: result.message,
                  duration: 2000,
                })
                .then((data: any): void => {
                  data.present();
                });
              this.moveGroup.controls.depositRequest.setValue(null);
              this.getList();
  
              if (result.message === 'Solicitud Hecha Con Exito') {
                this.getUserInfo();
              }
            }
          ),
          catchError(
            (error: HttpErrorResponse) => {
              console.log(error);
              this.toastController
                .create({
                  message: 'Error en el proceso',
                  duration: 2000,
                })
                .then((data: any): void => {
                  data.present();
                });
              return throwError(()=>error);
            }
          )
        )
        .subscribe();
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
      this.loading = true;
      this.movementService
        .rechargeRequest(`${this.moveGroup.controls.rechargeRequest.value}`).pipe(
          map(
            (result) => {
              this.loading = false;
              if (result.message === 'Solicitud Hecha Con Exito') {
                this.toastController
                  .create({
                    message: result.message,
                    duration: 2000,
                    color: 'primary'
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
          ),
          catchError(
            (error: HttpErrorResponse) => {
              console.log(error);
              this.toastController
                  .create({
                    message: 'Hubo un problema revise los movimientos',
                    duration: 2000,
                  })
                  .then((data: any): void => {
                    data.present();
                  });
            return throwError(()=>error);
            }
          )
        )
        .subscribe();
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
    this.loading = true;
    (await this.folderService.getUserInfo()).pipe(
      map(
        async (result) => {
          this.user.saldo = parseInt(result.monedero).toLocaleString('es-MX');
          this.user.bonus = parseInt(result.bonus).toLocaleString('es-MX');
  
          await this.folderService.setUser(this.user);
          this.loading = false;
        },
      ),
      catchError(
        async (error) => {
          this.loading = false;
          console.log(error);
          const toast = await this.toastController.create({
            message: 'Error cargando la informacaion de usuario',
            duration: 2000,
          });
          toast.present();
        }
      )
    ).subscribe();
  };
  
  ngOnInit() {
    const appDate = new Date();
    this.date = moment(appDate).format('DD-MM-YYYY');
    this.getList();
    this.user = this.movementService.getUser();
  }
}
