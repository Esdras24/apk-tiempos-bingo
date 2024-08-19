import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistryComponent } from './pages/auth/registry/registry.component';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'registry',
    pathMatch: 'full',
    component: RegistryComponent,
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: '**',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
