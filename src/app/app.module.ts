import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { FolderPage } from './pages/folder/folder.page';
import { InfoComponent } from './pages/info/info.component';
import { MovementsComponent } from './pages/movements/movements.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ResultsComponent } from './pages/results/results.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { UserComponent } from './pages/user/user.component';
import { RegistryComponent } from './pages/auth/registry/registry.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FolderPage,
    MovementsComponent,
    TicketsComponent,
    UserComponent,
    TicketComponent,
    InfoComponent,
    ResultsComponent,
    NotificationsComponent,
    RegistryComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxDatatableModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
