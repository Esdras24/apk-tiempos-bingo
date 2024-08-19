import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  archiveOutline,
  cartOutline,
  cashOutline,
  exitOutline,
  fileTrayStackedOutline,
  personOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage {
  public appPages = [
    { title: 'Venta', url: '/app/sell', icon: 'cart-outline' },
    { title: 'Movimientos', url: '/app/movements', icon: 'archive-outline' },
    {
      title: 'Ticketes',
      url: '/app/tickets',
      icon: 'file-tray-stacked-outline',
    },
    { title: 'Usuario', url: '/app/user', icon: 'person-outline' },
    {
      title: 'Notificaciones',
      url: '/app/notifications',
      icon: 'alert-circle-outline',
    },
    { title: 'Números Ganadores', url: '/app/results', icon: 'cash-outline' },
    { title: 'Bingos', url: '/app/bingo', icon: 'cash-outline' },
    { title: 'Cerrar Sesion', url: '/login', icon: 'exit-outline' },
  ];

  constructor() {
    addIcons({
      cartOutline,
      archiveOutline,
      fileTrayStackedOutline,
      personOutline,
      alertCircleOutline,
      cashOutline,
      exitOutline
    });
  }
}
