import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FolderPageRoutingModule } from './folder-routing.module';
import { FolderPage } from './folder.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SellPage } from '../sell/sell.page';
import { MovementsComponent } from '../movements/movements.component';
import { TicketsComponent } from '../tickets/tickets.component';
import { UserComponent } from '../user/user.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ResultsComponent } from '../results/results.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
  ],
  declarations: [
    FolderPage,
    SellPage,
    MovementsComponent,
    TicketsComponent,
    UserComponent,
    NotificationsComponent,
    ResultsComponent
  ],
})
export class FolderPageModule {}
