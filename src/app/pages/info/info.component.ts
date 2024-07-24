import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @Input() public info: any;
  @Input() public type: string;
  constructor(private modalController: ModalController) {}

  dissmis() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    console.log(this.info);
  }
}
