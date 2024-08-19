import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class InfoComponent {
  @Input() public info: any;
  @Input() public type!: string;
  constructor(private modalController: ModalController) {}

  dissmis() {
    this.modalController.dismiss();
  }

}
