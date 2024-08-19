import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { TicketComponent } from '../ticket/ticket.component';
import { FolderService } from '../folder/folder.service';


@Component({
  selector: 'sell-folder',
  templateUrl: './sell.page.html',
  styleUrls: ['./sell.page.scss'],
})
export class SellPage implements OnInit {
  @ViewChild('numberInput') numberInput;
  public ticketDataFormGroup = new FormGroup({
    raffle: new FormControl('', [Validators.required]),
    total: new FormControl('0'),
    amountInput: new FormControl('', [Validators.required]),
    numberInput: new FormControl('', [
      Validators.required,
      Validators.maxLength(2),
    ]),
  });
  public folder: string;
  user: UserEntity;
  public raffles = [];
  public dataToSend = [];

  constructor(
    private folderService: FolderService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  async openModal(ticket: number, data: any, raffle: string, total: string) {
    const actualDate = new Date();
    const date = moment(actualDate).format('DD-MM-YYYY');
    const modal = await this.modalController.create({
      component: TicketComponent,
      componentProps: { data, ticket, raffle, total, date },
    });
    modal.present();
  }

  async getRaffles() {
    (await this.folderService.getRaffles()).subscribe(
      (result) => {
        this.raffles = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async cambio() {
    const raffle = this.ticketDataFormGroup.controls.raffle.value;
    this.ticketDataFormGroup.controls.amountInput.setValue('');
    this.ticketDataFormGroup.controls.numberInput.setValue('');
    this.ticketDataFormGroup.controls.total.setValue('0');
    this.dataToSend = [];

    if (
      raffle === 'Rev Dia' ||
      raffle === 'Rev Tarde' ||
      raffle === 'Rev Noche'
    ) {
      const toast = await this.toastController.create({
        message:
          // eslint-disable-next-line max-len
          'Al seleccionar REVENTADOS, se duplica el costo, ya que estas comprando el mismo monto del reventado en el sorteo correspondiente',
        duration: 5000,
      });
      toast.present();
    }
  }

  async add() {
    const raffle = this.ticketDataFormGroup.controls.raffle.value;

    if (raffle === '') {
      const toast = await this.toastController.create({
        message: 'Debe seleccionar un sorteo',
        duration: 2000,
      });
      toast.present();
    } else {
      const amount = this.ticketDataFormGroup.controls.amountInput.value;
      let number = this.ticketDataFormGroup.controls.numberInput.value;
      let needAdd = true;

      //validar el numero
      if (parseInt(number) > 99 || parseInt(number) < 0 || number === '') {
        const toast = await this.toastController.create({
          message: 'Número inválido',
          duration: 2000,
        });
        toast.present();
      } else {
        //se busca el monto en el data
        this.dataToSend.map((element) => {
          if (parseInt(element.monto) === parseInt(amount)) {
            element.numeros.push(number);
            needAdd = false;
          }
          return element;
        });

        if (needAdd) {
          this.dataToSend.push({
            monto: amount,
            numeros: [number],
          });
        }

        let subTotal = parseInt(this.ticketDataFormGroup.controls.total.value);

        let toAdd = parseInt(
          this.ticketDataFormGroup.controls.amountInput.value
        );
        if (
          raffle === 'Rev Dia' ||
          raffle === 'Rev Tarde' ||
          raffle === 'Rev Noche'
        ) {
          toAdd = toAdd * 2;
        }
        subTotal = subTotal + toAdd;

        this.ticketDataFormGroup.controls.total.setValue(`${subTotal}`);
      }
    }
    this.ticketDataFormGroup.controls.numberInput.setValue('');
    this.numberInput.setFocus();
  }

  removeChip = async (number: string, amount: string) => {
    this.dataToSend.map((element, dataIndex) => {
      if (parseInt(element.monto) === parseInt(amount)) {
        const index = element.numeros.indexOf(number);
        element.numeros.splice(index, 1);
        if (element.numeros.length === 0) {
          this.dataToSend.splice(dataIndex, 1);
        }
      }
      return element;
    });
    let subTotal = parseInt(this.ticketDataFormGroup.controls.total.value);
    const raffle = this.ticketDataFormGroup.controls.raffle.value;

    if (
      raffle === 'Rev Dia' ||
      raffle === 'Rev Tarde' ||
      raffle === 'Rev Noche'
    ) {
      const toSub = parseInt(amount) * 2;
      subTotal = subTotal - toSub;
    } else {
      subTotal = subTotal - parseInt(amount);
    }

    this.ticketDataFormGroup.controls.total.setValue(`${subTotal}`);
  };

  submit = async () => {
    //primero se valida que no vaya vacio el ticket
    if (this.dataToSend.length === 0) {
      const toast = await this.toastController.create({
        message: 'No puedes enviar un ticket vacio',
        duration: 2000,
      });
      toast.present();
    } else {
      const sorteo = this.ticketDataFormGroup.controls.raffle.value;
      //se valida que el sorteo no vaya vacio
      if (sorteo === '') {
        const toast = await this.toastController.create({
          message: 'No puedes enviar un ticket sin sorteo',
          duration: 2000,
        });
        toast.present();
      } else {
        const finalData = {
          sorteo: sorteo,
          datos: this.dataToSend,
        };
        (await this.folderService.save(finalData, this.user)).subscribe(
          async (result) => {
            if (result.mensaje2 === 'ok') {
              this.ticketDataFormGroup.controls.amountInput.setValue('');
              this.ticketDataFormGroup.controls.numberInput.setValue('');
              this.getUserInfo();
              //llamar al ticket
              this.openModal(
                parseInt(result.mensaje),
                this.dataToSend,
                sorteo,
                this.ticketDataFormGroup.controls.total.value
              );
              this.dataToSend = [];
              this.ticketDataFormGroup.controls.total.setValue('0');
            } else {
              const toast = await this.toastController.create({
                message: result.mensaje3,
                duration: 2000,
              });
              toast.present();
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  };

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

  async ngOnInit() {
    this.dataToSend = [];
    this.user = await this.folderService.getUser();
    this.getRaffles();
    this.getUserInfo();
  }
}
