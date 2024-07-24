import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {
  @Input() public data: any;
  @Input() public ticket: number;
  @Input() public total: number;
  @Input() public raffle: string;
  @Input() public date: string;

  public subRaffle = null;
  public dataToSend: any;
  constructor(private modalController: ModalController) {}

  dissmis() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    switch (this.raffle) {
      case 'Rev Dia': {
        this.subRaffle = 'Digital Dia';
        break;
      }
      case 'Rev Tarde': {
        this.subRaffle = 'Digital Tarde';
        break;
      }
      case 'Rev Noche': {
        this.subRaffle = 'Digital Noche';
        break;
      }
    }
  }
}
