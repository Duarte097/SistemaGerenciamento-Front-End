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
  path: '**',
  redirectTo: '/login'
},
{
  path: 'dashboard',
  loadChildren: () => import('./modules/dashboard/dashBoard.module').then(m => m.DashboardModule),
  canActivate: [AuthGuard]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
