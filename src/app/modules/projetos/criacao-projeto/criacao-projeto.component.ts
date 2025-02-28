import { UserService } from './../../../service/user/User.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';  // Importa o CalendarModule
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {  DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AuthRequest } from 'src/app/models/interfaces/user/AuthRequest';
import { Subject, takeUntil } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TasksDataTransferService } from 'src/app/shared/services/tasks/tasks-data-transfer.service';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { CreateTaskRequest } from 'src/app/models/interfaces/tasks/request/CreateTaskRequest';
import { ReactiveFormsModule } from '@angular/forms';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';



@Component({
  selector: 'app-criacao-projeto',
  templateUrl: './criacao-projeto.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    DropdownModule,
    InputTextareaModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./criacao-projeto.component.css']
})
export class CriacaoProjetoComponent implements OnInit, OnDestroy  {
  private readonly destroy$: Subject<void> = new Subject();
  public tasksList: Array<GetAllTasksResponse> = [];
  public userList: Array<GetAllUsersResponse> = [];
  createProjetoForm: FormGroup;
  value1: string | undefined;
  date2: Date | undefined;
  date3: Date | undefined;
  status: any[] = [];
  usuarios: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tasksDtService: TasksDataTransferService,
    private usersDtService: TasksDataTransferService,
    private tasksServices: TasksService,
    private userService : UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router,
  ){
    this.createProjetoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      status: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
  }


  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();  // Emite um evento para o componente pai fechar o modal
  }

  selectedProjetos: any;
  selectedUsuarios: any;

  ngOnInit() {
    this.status = [
      { name: 'CONCLUIDO', code: 'CONCLUIDO' },
      { name: 'EM_ANDAMENTO', code: 'EM_ANDAMENTO' },
      { name: 'CANCELADO', code: 'CANCELADO' },
      { name: 'PLANEJADO', code: 'PLANEJADO' }
    ];
    this.usuarios = [
      {nome: 'Leonardo Ramalho Duarte', code: 'Leonardo Ramalho Duarte'},
    ];
  }

  onSubmit(): void {
    console.log('Formulário enviado', this.createProjetoForm.value);
    if (this.createProjetoForm.valid) {
      // Chamando o serviço para criar o projeto (ou tarefa)
      const taskData: CreateTaskRequest = {
        nome: this.createProjetoForm.value.nome,
        descricao: this.createProjetoForm.value.descricao,
        dataInicio: this.createProjetoForm.value.dataInicio,
        dataFim: this.createProjetoForm.value.dataFim,
        status: this.createProjetoForm.value.status,
        idUsuario: this.createProjetoForm.value.idUsuario,
      };
      this.tasksServices.createTask(taskData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.cookieService.set('USER_INFO', response.id);
              this.createProjetoForm.reset();
              this.router.navigate(['/projetos']);

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Projeto criado com sucesso!',
                life: 2000
              });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar o projeto!',
              life: 2000
            });
            console.log(err);
          }
        }
      );
    }
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

  getUsersDatas(): void {
    this.userService
    .getAllUsers()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        if(response.length > 0) {
          this.userList = response;
          this.tasksDtService.setTasksDatas(this.tasksList);
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar os usuários!',
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
