import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogService } from 'primeng/dynamicdialog';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BodyComponent } from '../modules/body/body.component';

@NgModule({
  declarations: [
    ToolbarNavigationComponent,
    BodyComponent
  ],
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    //PrimeNg
    ToolbarModule,
    CardModule,
    ButtonModule,
    MenubarModule,
    BadgeModule,
    AvatarModule,
  ],
  exports: [
    ToolbarNavigationComponent,
    BodyComponent,
    CardModule
  ],
  providers: [DialogService, CurrencyPipe],
})
export class SharedModule { }
