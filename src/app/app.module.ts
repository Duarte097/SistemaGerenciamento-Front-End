import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './modules/pages/login/login.component';
import { CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { CookieService } from 'ngx-cookie-service';
import { AtividadesComponent } from './modules/atividades/atividades.component';
import { ProjetosComponent } from './modules/projetos/projetos.component';
import { UsuariosComponent } from './modules/usuarios/usuarios.component';
import { CommonModule } from '@angular/common';
import { PrimeIcons } from 'primeng/api';
import { BodyComponent } from './modules/body/body.component';
import { OverlayModule } from 'primeng/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AtividadesComponent,
    ProjetosComponent,
    UsuariosComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,
    ToolbarModule,
    BrowserModule,
    OverlayModule,
    CdkMenuModule
  ],
  providers: [
    CookieService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

