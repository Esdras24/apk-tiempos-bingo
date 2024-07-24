import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Venta', url: '/app', icon: 'cart-outline' },
    { title: 'Movimientos', url: '/movements', icon: 'archive-outline' },
    { title: 'Ticketes', url: '/tickets', icon: 'file-tray-stacked-outline' },
    { title: 'Usuario', url: '/user', icon: 'person-outline' },
    {
      title: 'Notificaciones',
      url: '/notifications',
      icon: 'alert-circle-outline',
    },
    { title: 'Números Ganadores', url: '/results', icon: 'cash-outline' },
    { title: 'Cerrar Sesion', url: '/login', icon: 'exit-outline' },
  ];

  constructor() {}
}
