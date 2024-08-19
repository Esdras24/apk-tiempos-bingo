import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FolderPage } from './folder.page';
import { SellPage } from '../sell/sell.page';
import { MovementsComponent } from '../movements/movements.component';
import { TicketsComponent } from '../tickets/tickets.component';
import { UserComponent } from '../user/user.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ResultsComponent } from '../results/results.component';
import { BingoPage } from '../bingo/bingo.page';

const routes: Routes = [
  {
    path: '',
    component: FolderPage,
    children:[
      {
        path: 'sell',
        component: SellPage
      },
      {
        path: 'movements',
        component: MovementsComponent,
      },
      {
        path: 'tickets',
        component: TicketsComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
      {
        path: 'results',
        component: ResultsComponent,
      },
      {
        path: 'bingo',
        component: BingoPage,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
