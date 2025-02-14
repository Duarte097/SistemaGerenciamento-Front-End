import { TasksService } from './../../../../service/tasks/tasks.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TasksTableComponent } from '../tasks-table/tasks-table.component';
import { CreateTaskRequest } from 'src/app/models/interfaces/tasks/request/CreateTaskRequest';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { EventAction } from 'src/app/models/interfaces/tasks/event/EventAction';
import { TasksDataTransferService } from 'src/app/shared/services/tasks/tasks-data-transfer.service';
import { EditTaskRequest } from 'src/app/models/interfaces/tasks/request/EditTaskRequest';
import { TasksEvent } from 'src/app/models/enums/tasks/TasksEvent';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<string> = [];
  public selectedCategory: Array<{name: string, code: string}> = [];
  public taskAction!: {
    event: EventAction;
    taskDatas: Array<GetAllTasksResponse>;
  };
  public tasksDatas: Array<GetAllTasksResponse> = [];
  public taskSelectedDatas!: GetAllTasksResponse;
  public addTaskForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
  });

  public editTaskForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
  })

  public addTasksEvent = TasksEvent.ADD_TASKS_EVENT;
  public editTasksAction = TasksEvent.EDIT_TASKS_EVENT;
  constructor(
    private messageService: MessageService,
    private tasksService: TasksService,
    private router: Router,
    private formBuilder: FormBuilder,
    public ref: DynamicDialogConfig,
    public tasksDTService: TasksDataTransferService,
  ){}
  ngOnInit(): void {
    this.taskAction = this.ref.data;
    if(this.taskAction?.event?.action === this.editTasksAction && this.taskAction?.taskDatas){
      this.getTaskSelectedDatas(this.taskAction?.event?.id as string);
    }
  }


  handleSubmitAddTask(): void{
    if(this.addTaskForm?.value && this.addTaskForm.valid){
      const requestCreateTask: CreateTaskRequest = {
        name: this.addTaskForm.value.name as string,
        description: this.addTaskForm.value.description as string,
        amount: Number(this.addTaskForm.value.amount)
      };
      this.tasksService.createTask(requestCreateTask)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response){
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Tarefa criada com sucesso!',
              life: 2500,
            });
          }
        }, error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar tarefa',
            life: 2500,
          });
        }
      })
    }
    this.addTaskForm.reset();
  }

  handleSubmitEditTask(): void {
    if(this.editTaskForm.value && this.editTaskForm.valid && this.taskAction.event.id){
      const requestEditTask: EditTaskRequest = {
        name: this.editTaskForm.value.name as string,
        description: this.editTaskForm.value.description as string,
        amount: this.editTaskForm.value.amount as number,
      };
      this.tasksService
        .editTask(requestEditTask)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Tarefa editada com sucesso!',
            life: 2500,
          });
          this.editTaskForm.reset();
          }, error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar tarefa',
              life: 2500,
            });
          }
        });
        this.editTaskForm.reset();
    }
  }

  getTaskSelectedDatas(taskId: string): void {
    const allTasks = this.taskAction?.taskDatas;
    if(allTasks.length > 0){
      const tasksFiltered = allTasks.filter(
        (element) => element?.id === +taskId
      );
      if(tasksFiltered) {
        this.taskSelectedDatas = tasksFiltered[0];
        this.editTaskForm.setValue({
          name: this.taskSelectedDatas?.name,
          description: this.taskSelectedDatas?.description,
          amount: this.taskSelectedDatas?.amount
        })
      }
    }
  }

  getTasksDatas(): void {
    this.tasksService.getAllTasks()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.tasksDatas = response;
          this.tasksDatas && this.tasksDTService.setTasksDatas(this.tasksDatas);
        }
      }, error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar tarefas',
          life: 2500,
        });
        this.router.navigate(['/dashboard']);
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
