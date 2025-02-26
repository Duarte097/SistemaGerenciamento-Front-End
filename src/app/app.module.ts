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
import { UsuariosComponent } from './modules/usuarios/usuarios.component';
import { CommonModule } from '@angular/common';
import { OverlayModule } from 'primeng/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ToolbarNavigationComponent } from './modules/toolbar-navigation/toolbar-navigation.component';
import { BodyComponent } from './modules/body/body.component';
import { HeaderComponent } from './modules/header/header.component';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsuariosComponent,
    ToolbarNavigationComponent,
    BodyComponent,
    HeaderComponent,
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
    CdkMenuModule,
    RouterModule,
    MenubarModule,
    BadgeModule,
    AvatarModule,
  ],
  providers: [
    CookieService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

