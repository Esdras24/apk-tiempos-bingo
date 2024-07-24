import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { ResultsService } from './results.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  public data = [];
  public user: UserEntity;
  constructor(
    private resultService: ResultsService,
    private toastController: ToastController
  ) {}

  cargarGanadores = () => {
    const date = new Date();
    const actualDate = moment(date).format('YYYY-MM-DD');

    this.resultService.getList(actualDate).subscribe(
      (result) => {
        let ultimoSorteo = '';
        let ultimo = result.data.length - 1;
        let numeros = [];

        //se recorre el arreglo
        for (let index = 0; index < result.data.length; index++) {
          const element = result.data[index];

          //se cargan los numeros si el sorteo es el mismo o es el inicio del array
          if (element.tipoLoteria === ultimoSorteo || index === 0) {
            numeros.push({
              registro: element.registro,
              horario: element.horario,
            });
            if (index === 0) {
              ultimoSorteo = element.tipoLoteria;
            }

            //si cambia el sorteo se añade un bloque al array deseado
          } else {
            this.data.push({
              tipo: ultimoSorteo,
              datos: numeros,
            });
            ultimoSorteo = element.tipoLoteria;
            numeros = [];
            numeros.push({
              registro: element.registro,
              horario: element.horario,
            });
          }

          //si es el ultimo se añade al array deseado
          if (ultimo === index) {
            this.data.push({
              tipo: ultimoSorteo,
              datos: numeros,
            });
          }
        }

        console.log(this.data);
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: 'Error cargando los números ganadores',
          duration: 2000,
        });
        toast.present();
      }
    );
  };

  linea() {
    setInterval(this.cargarGanadores, 180000);
  }

  ngOnInit() {
    this.user = this.resultService.getUser();
    this.cargarGanadores();
    this.linea();
  }
}
