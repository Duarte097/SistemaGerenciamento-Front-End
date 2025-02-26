import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { TasksDataTransferService } from 'src/app/shared/services/tasks/tasks-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public tasksList: Array<GetAllTasksResponse> = [];
  constructor(
    private tasksServices: TasksService,
    private messageService: MessageService,
    private tasksDtService: TasksDataTransferService
  ){}


  ngOnInit(): void {
    this.getTasksDatas();
  }

  getTasksDatas(): void {
    this.tasksServices
    .getAllTasks()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        if(response.length > 0) {
          this.tasksList = response;
          this.tasksDtService.setTasksDatas(this.tasksList);
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos!',
          life: 2500,
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
