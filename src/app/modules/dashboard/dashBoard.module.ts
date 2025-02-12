import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DashboardHomeComponent } from "./dashboard-home1/dashboard-home.component";
import { RouterModule } from "@angular/router";
import { DASHBOARD_ROUTES } from "./darshboard.routing";
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { ToastModule } from "primeng/toast";
import { CookieService } from "ngx-cookie-service";
import { MessageService } from "primeng/api";
@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    ToastModule
  ],
  providers: [MessageService, CookieService],
})
export class DashboardModule{}
