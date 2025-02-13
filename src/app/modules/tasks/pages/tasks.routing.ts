import { Routes } from '@angular/router';
import { TasksHomeComponent } from './tasks-home/tasks-home.component';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    component: TasksHomeComponent
  }
];
