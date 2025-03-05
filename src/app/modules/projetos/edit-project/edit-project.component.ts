import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {  DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';
import { UserService } from 'src/app/service/user/User.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { EditTaskRequest } from 'src/app/models/interfaces/tasks/request/EditTaskRequest';


@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    InputTextareaModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ToastModule
  ],
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit{
  private readonly destroy$: Subject<void> = new Subject();
  public tasksList: Array<GetAllTasksResponse> = [];
  public userList: Array<GetAllUsersResponse> = [];
  @Output() closeModalEdit = new EventEmitter<void>();
  @Input() projectId: number | null = null;
  public projectData: any = {
    usuarioResponsavel: {
      id_usuarios: null,
      nome: null
    }
  };
  public userData: any = {};
  editProjetoForm: FormGroup;
  selectedStatus: any;
  selectedUsuarios: any;
  selectedPrioridade: any;
  status: any[] = [];
  usuarios: any[] = [];
  prioridade: any[] = [];



  constructor(
    private tasksService: TasksService,
    private formBuilder: FormBuilder,
    private usersDtService: UsersDataTransferService,
    private tasksServices: TasksService,
    private userService : UserService,
    private messageService: MessageService,
  ) {
    this.editProjetoForm = this.formBuilder.group({
      nomeProjeto: ['', Validators.required],
      descricao: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      status: ['', Validators.required],
      prioridade: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
    this.userData ;
  }

  ngOnInit(): void {
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
    if (this.projectId) {
      this.loadProjectData();
      this.getUsersDatas();
      this.projectData.dataInicio = this.convertToDate(this.projectData.dataInicio);
      this.projectData.dataFim = this.convertToDate(this.projectData.dataFim);
    }else {
      console.log('Nenhum ID de projeto fornecido.');
    }
    console.log("ID do usuário:", this.projectData.usuarioResponsavel.id_usuarios);
  }


  close() {
    this.closeModalEdit.emit();  // Emite um evento para o componente pai fechar o modal
  }

  convertToDate(dateString: string): Date | null {
    if (!dateString) return null;
    const date = moment(dateString, 'DD/MM/YYYY', true); // O `true` força a validação estrita
    return date.isValid() ? date.toDate() : null;
  }


  onSubmit(): void {
    console.log('Formulário enviado', this.editProjetoForm.value);
    if (this.editProjetoForm.valid && this.projectId) {
      const taskData: EditTaskRequest = {
        nomeProjeto: this.editProjetoForm.value.nomeProjeto,
        descricao: this.editProjetoForm.value.descricao,
        dataInicio: this.editProjetoForm.value.dataInicio,
        dataFim: this.editProjetoForm.value.dataFim,
        status: this.editProjetoForm.value.status,
        prioridade: this.editProjetoForm.value.prioridade,
        idUsuario: this.editProjetoForm.value.idUsuario
      };
      console.log('Chamando tasksServices.createTask...');
      this.tasksServices.editTask(taskData, this.projectId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.close();
            console.log('Chamando messageService.add() com sucesso...');
            console.log('Mensagem de sucesso:', {
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Projeto editado com sucesso!',
              life: 2000
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Projeto editado com sucesso!',
              life: 2000
            });

          },
          error: (err) => {
            console.log('Chamando messageService.add() com erro...');
            console.log('Mensagem de erro:', {
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar o projeto!',
              life: 2000
            });
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar o projeto!',
              life: 2000
            });
          }
        }
      );
    }
  }

  loadProjectData() {
    console.log('Carregando projeto com ID:', this.projectId);
    this.tasksService.getProjectById(this.projectId ?? 0).subscribe({
      next: (data) => {
        console.log('Dados do projeto recebidos:', data);
        this.projectData = data;
        this.projectData.dataInicio = this.convertToDate(this.projectData.dataInicio);
        this.projectData.dataFim = this.convertToDate(this.projectData.dataFim);
      },
      error: (err) => {
        console.error('Erro ao carregar projeto:', err);
      }
    });
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
}
