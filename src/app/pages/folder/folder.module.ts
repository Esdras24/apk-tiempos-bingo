import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FolderPage } from './folder.page';
import { FolderPageRoutingModule } from './folder-routing.module';
import { MovementsComponent } from '../movements/movements.component';
import { TicketsComponent } from '../tickets/tickets.component';
import { UserComponent } from '../user/user.component';
import { TicketComponent } from '../ticket/ticket.component';
import { InfoComponent } from '../info/info.component';
import { ResultsComponent } from '../results/results.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { SellPage } from '../sell/sell.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FolderPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [
    FolderPage,
    MovementsComponent,
    TicketsComponent,
    UserComponent,
    TicketComponent,
    InfoComponent,
    ResultsComponent,
    NotificationsComponent,
    SellPage
  ],
})
export class FolderPageModule {}
