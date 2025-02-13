import { ToolbarModule } from 'primeng/toolbar';
import { Component } from '@angular/core';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { Subject, takeUntil } from 'rxjs';
import { TasksDataTransferService } from 'src/app/shared/services/tasks/tasks-data-transfer.service';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks-home',
  templateUrl: './tasks-home.component.html',
  styleUrls: ['./tasks-home.component.css']
})
export class TasksHomeComponent  {
  private readonly destroy$: Subject<void> = new Subject();
  public tasksDatas: Array<GetAllTasksResponse> = [];
  constructor(
    private toolbar: ToolbarModule,
    private tasksDtService: TasksDataTransferService,
    private tasksService: TasksService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  getServiceTasksDatas() {
    const tasksLoaded = this.tasksDtService.getTasksDatas();

    if (tasksLoaded.length > 0) {
      this.tasksDatas = tasksLoaded;
    } else this.getAPITasksDatas();

  }

  getAPITasksDatas() {
    this.tasksService
      .getAllTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.tasksDatas = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }
}
