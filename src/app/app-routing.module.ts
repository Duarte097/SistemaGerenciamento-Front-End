import { DashboardHomeComponent } from './modules/dashboard/dashboard-home/dashboard-home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/pages/login/login.component';
import { AuthGuard } from './guards/auth-guard.service';

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
  loadComponent: () => import('./modules/dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent),
  canActivate: [AuthGuard]
},
{
  path: 'projetos',
  loadComponent: () => import('./modules/projetos/projetos.component').then(m => m.ProjetosComponent),
  canActivate: [AuthGuard]
},
{
  path: 'atividades',
  loadComponent: () => import('./modules/atividades/atividades.component').then(m => m.AtividadesComponent),
  canActivate: [AuthGuard]
},
{
  path: 'criacaoProjeto',
  loadComponent: () => import('./modules/projetos/criacao-projeto/criacao-projeto.component').then(m => m.CriacaoProjetoComponent),
  canActivate: [AuthGuard]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
