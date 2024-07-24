import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { FolderPage } from './pages/folder/folder.page';
import { MovementsComponent } from './pages/movements/movements.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ResultsComponent } from './pages/results/results.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'app',
    pathMatch: 'full',
    component: FolderPage,
  },
  {
    path: 'movements',
    pathMatch: 'full',
    component: MovementsComponent,
  },
  {
    path: 'tickets',
    pathMatch: 'full',
    component: TicketsComponent,
  },
  {
    path: 'user',
    pathMatch: 'full',
    component: UserComponent,
  },
  {
    path: 'results',
    pathMatch: 'full',
    component: ResultsComponent,
  },
  {
    path: 'notifications',
    pathMatch: 'full',
    component: NotificationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
