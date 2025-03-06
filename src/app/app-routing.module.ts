import { DashboardHomeComponent } from './modules/dashboard/dashboard-home/dashboard-home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/pages/login/login.component';
import { AuthGuard } from './guards/auth-guard.service';
import { ProjetosComponent } from './modules/projetos/projetos.component';
import { AtividadesComponent } from './modules/atividades/atividades.component';
import { LayoutComponent } from './layout/layout.component';
import { LancamentoHorasComponent } from './modules/lancamento-horas/lancamento-horas.component';
import { UsuariosComponent } from './modules/usuarios/usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }, // Login é a tela inicial
  {
    path: 'app',
    component: LayoutComponent,
    children:
    [
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
      {
        path: 'lancamentoHoras',
        component: LancamentoHorasComponent,
        //canActivate: [AuthGuard]
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        //canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
