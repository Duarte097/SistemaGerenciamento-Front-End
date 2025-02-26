import { UsuariosComponent } from './modules/usuarios/usuarios.component';
import { Component } from '@angular/core';
import { AtividadesComponent } from './modules/atividades/atividades.component'; // Mude para o caminho correto
import { HeaderComponent } from './modules/header/header.component'; // Mude para o caminho correto
import { BodyComponent } from './modules/body/body.component'; // Mude para o caminho correto
import { LoginComponent } from './modules/pages/login/login.component'; // Mude para o caminho correto
import { ProjetosComponent } from './modules/projetos/projetos.component'; // Mude para o caminho correto
@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <app-body></app-body>
    <app-atividades></app-atividades>
    <app-login></app-login>
    <app-projetos></app-projetos>
    <app-usuarios></app-usuarios>
  `,
  standalone: true,
  imports: [HeaderComponent, BodyComponent, AtividadesComponent, LoginComponent, ProjetosComponent, UsuariosComponent] // Inclua todos os componentes
})
export class AppComponent {
  title = 'SistemaGerenciamento-Front-End';
}
