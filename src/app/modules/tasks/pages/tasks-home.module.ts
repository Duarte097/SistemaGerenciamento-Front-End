import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { ToastModule } from "primeng/toast";
import { SharedModule} from 'src/app/shared/shared.module';
import { TasksHomeComponent } from "./tasks-home/tasks-home.component";
import { TasksTableComponent } from "../components/tasks-table/tasks-table.component";
import { RouterModule } from '@angular/router';
import { TASKS_ROUTES } from "./tasks.routing";
import { CardModule } from "primeng/card";

@NgModule({
  declarations: [TasksHomeComponent, TasksTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    ToastModule,
    SharedModule,
    CardModule,
    RouterModule.forChild(TASKS_ROUTES)
  ]
})
export class TasksHomeModule { }
