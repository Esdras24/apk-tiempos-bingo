import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { SortType } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { FolderService } from '../folder/folder.service';
import { TicketComponent } from '../ticket/ticket.component';
import { TicketsService } from './tickets.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  public showDateTime = false;
  public date = '';
  public columns: any;
  public user!: UserEntity;
  public rows: any[] = [];
  public SortType = SortType;
  public ticketGroup = new FormGroup({
    date: new FormControl(),
    ticketNumber: new FormControl(null),
  });

  constructor(
    private ticketsService: TicketsService,
    private folderService: FolderService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
    this.columns = [
      { name: 'Tiquete' },
      { name: 'Horario' },
      { name: 'Balance' },
    ];
  }

  reloadTicket(ticket: any) {
    this.ticketsService.reviewTicket(ticket).subscribe(
      async (result) => {
        let data = [];
        let lastAmount = '';
        let numbers = [];
        let raffle = '';
        let total = 0;
        let date = '';
        let reventadoEnSorteos = false;
        const lastIndex = result.length - 1;

        for (let index = 0; index < result.length; index++) {
          const element = result[index];

          if (element) {
            if (element.tipo === 'Reventados' && !reventadoEnSorteos) {
              reventadoEnSorteos = true;
              data = [];
              lastAmount = '';
              numbers = [];
              raffle = '';
              total = 0;

              if (element.tipo === 'Reventados' && index === 0) {
                //se inicia con el valor de index 0
                total = total + parseInt(element.monto);
                numbers = [element.numero];
                lastAmount = element.monto;
              }
              index = 0;
            } else {
              if (
                (reventadoEnSorteos && element.tipo === 'Reventados') ||
                !reventadoEnSorteos
              ) {
                total = total + parseInt(element.monto);
                raffle = element.horario;
                date = element.fecha;
                if (lastAmount === element.monto || index === 0) {
                  numbers.push(element.numero);
                  if (index === 0) {
                    lastAmount = element.monto;
                  }
                } else {
                  data.push({
                    monto: lastAmount,
                    numeros: numbers,
                  });
                  numbers = [element.numero];
                  lastAmount = element.monto;
                }
              }

              if (lastIndex === index) {
                data.push({
                  monto: lastAmount,
                  numeros: numbers,
                });
              }
            }
          }
        }

        if (reventadoEnSorteos) {
          total = total * 2;
        }

        const modal = await this.modalController.create({
          component: TicketComponent,
          componentProps: { data, ticket, raffle, total, date },
        });
        modal.present();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  dateChange() {
    this.date = moment(this.ticketGroup.controls.date.value).format(
      'DD-MM-YYYY'
    );
    this.showDateTime = !this.showDateTime;
    this.getList();
  }

  getList() {
    const dateToSend = this.ticketGroup.controls.date.value
      ? this.ticketGroup.controls.date.value
      : new Date();
    this.ticketsService
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

  deleteTicket() {
    if (this.ticketGroup.controls.ticketNumber.value) {
      this.ticketsService
        .ticketDelete(`${this.ticketGroup.controls.ticketNumber.value}`)
        .subscribe(
          (result) => {},
          (error) => {
            if (error.error.text === 'Eliminado Exitosamente') {
              this.getUserInfo();
              this.toastController
                .create({
                  message: 'Eliminado Exitosamente',
                  duration: 2000,
                })
                .then((data: any): void => {
                  data.present();
                });
              this.ticketGroup.controls.ticketNumber.setValue(null);
            } else {
              this.toastController
                .create({
                  message: error.error.text,
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
          message: 'Debe de colocar un numero',
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
    this.user = this.ticketsService.getUser();
    const appDate = new Date();
    this.date = moment(appDate).format('DD-MM-YYYY');
    this.getList();
  }
}
