import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/pages/login/login.component';
import { HomeComponent } from './modules/pages/home/home.component';
import { DashboardHomeComponent } from './modules/dashboard/dashboard-home1/dashboard-home.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'login',
  pathMatch: 'full'
},
{
  path: 'login',
  component: LoginComponent,
},
{
  path: 'home',
  component: HomeComponent
},
{
  path: 'dashboard',
  loadChildren: () => import('./modules/dashboard/dashBoard.module').then(m => m.DashboardModule)
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
