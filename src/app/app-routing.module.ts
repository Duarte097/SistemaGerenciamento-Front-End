import { DashboardHomeComponent } from './modules/dashboard/dashboard-home/dashboard-home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/pages/login/login.component';
import { AuthGuard } from './guards/auth-guard.service';
import { ProjetosComponent } from './modules/projetos/projetos.component';
import { AtividadesComponent } from './modules/atividades/atividades.component';

const routes: Routes = [{
  path: '',
  redirectTo: '/login',
  pathMatch: 'full'
},
{
  path: 'login',
  component: LoginComponent,
},
{
  path: 'dashboard',
  component: DashboardHomeComponent,
  //canActivate: [AuthGuard]
},
{
  path: 'projetos',
  component: ProjetosComponent,
  //canActivate: [AuthGuard]
},
{
  path: 'atividades',
  component: AtividadesComponent,
  //canActivate: [AuthGuard]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
