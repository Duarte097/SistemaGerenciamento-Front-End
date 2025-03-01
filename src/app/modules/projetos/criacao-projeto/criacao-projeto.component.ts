import { UserService } from './../../../service/user/User.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';  // Importa o CalendarModule
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {  DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { CreateTaskRequest } from 'src/app/models/interfaces/tasks/request/CreateTaskRequest';
import { ReactiveFormsModule } from '@angular/forms';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';



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
    ReactiveFormsModule,
    ToastModule
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
  prioridade: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private usersDtService: UsersDataTransferService,
    private tasksServices: TasksService,
    private userService : UserService,
    private messageService: MessageService,
  ){
    this.createProjetoForm = this.formBuilder.group({
      nomeProjeto: ['', Validators.required],
      descricao: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      status: ['', Validators.required],
      prioridade: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
  }


  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();  // Emite um evento para o componente pai fechar o modal
  }

  selectedStatus: any;
  selectedUsuarios: any;
  selectedPrioridade: any;


  ngOnInit() {
    this.getUsersDatas()
    this.messageService.add({ severity: 'success', summary: 'Teste', detail: 'Mensagem de teste!' });
    this.status = [
      { name: 'CONCLUIDO', code: 'CONCLUIDO' },
      { name: 'EM_ANDAMENTO', code: 'EM_ANDAMENTO' },
      { name: 'CANCELADO', code: 'CANCELADO' },
      { name: 'PLANEJADO', code: 'PLANEJADO' }
    ];
    this.prioridade = [
      { name: 'ALTA', code: 'ALTA' },
      { name: 'MÉDIA', code: 'MEDIA' },
      { name: 'BAIXA', code: 'BAIXA' }
    ];
  }

  visualizarDados(): void {
    console.log('Dados do formulário:', this.createProjetoForm.value);
    console.log('Status selecionado:', this.selectedStatus);
    console.log('Usuário selecionado:', this.selectedUsuarios);
    console.log('Prioridade selecionada:', this.selectedPrioridade);
  }

  onSubmit(): void {
    console.log('Formulário enviado', this.createProjetoForm.value);
    if (this.createProjetoForm.valid) {
      const taskData: CreateTaskRequest = {
        nomeProjeto: this.createProjetoForm.value.nomeProjeto,
        descricao: this.createProjetoForm.value.descricao,
        dataInicio: this.createProjetoForm.value.dataInicio,
        dataFim: this.createProjetoForm.value.dataFim,
        status: this.createProjetoForm.value.status,
        prioridade: this.createProjetoForm.value.prioridade,
        idUsuario: this.createProjetoForm.value.idUsuario,
      };
      console.log('Chamando tasksServices.createTask...');
      this.tasksServices.createTask(taskData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              //this.createProjetoForm.reset();
              this.closeModal.emit();
              console.log('Chamando messageService.add() com sucesso...');
              console.log('Mensagem de sucesso:', {
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Projeto criado com sucesso!',
                life: 2000
              });
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Projeto criado com sucesso!',
                life: 2000
              });
            }
          },
          error: (err) => {
            console.log('Chamando messageService.add() com erro...');
            console.log('Mensagem de erro:', {
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar o projeto!',
              life: 2000
            });
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar o projeto!',
              life: 2000
            });
            setTimeout(() => {
              new this.closeModal(); // Fecha o modal após um pequeno delay
            }, 1000);
          }
        }
      );
    }
  }

  getUsersDatas(): void {
    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Resposta da API de usuários:', response);
          if (response.length > 0) {
            this.userList = response; // Armazena a lista de usuários retornados

            this.usuarios = response.map(user => ({
              nome: user.nome,
              id_usuarios: user.id_usuarios
            }));

            console.log('Usuários carregados:', this.usuarios); // Log da lista de usuários carregados
            this.usersDtService.setUsersDatas(this.userList);
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar os usuários!',
            life: 2500,
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
