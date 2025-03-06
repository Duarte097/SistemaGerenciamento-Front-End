import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { EditActivityRequest } from 'src/app/models/interfaces/atividades/EditActivityRequest';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';
import { ActivityService } from 'src/app/service/activity/activity.service';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { UserService } from 'src/app/service/user/User.service';
import { TasksDataTransferService } from 'src/app/shared/services/tasks/tasks-data-transfer.service';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  standalone: true,
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
  styleUrls: ['./edit-activity.component.css']
})
export class EditActivityComponent {
  private readonly destroy$: Subject<void> = new Subject();
  public tasksList: Array<GetAllTasksResponse> = [];
  public userList: Array<GetAllUsersResponse> = [];
  @Output() closeModalEdit = new EventEmitter<void>();
  @Input() activityId: number | null = null;
  public activityData: any = {
    projeto: {
      id_projetos: null,
      nomeProjeto: null
    },
    usuarioResponsavel: {
      id_usuarios: null,
      nome: null
    }
  };
  public userData: any = {};
  public projectData: any = {};
  editActivityForm: FormGroup;
  selectedStatus: any;
  selectedUsuarios: any;
  selectedPrioridade: any;
  status: any[] = [];
  usuarios: any[] = [];
  projeto: any[] = [];



  constructor(
    private tasksService: TasksService,
    private formBuilder: FormBuilder,
    private usersDtService: UsersDataTransferService,
    private tasksDtService: TasksDataTransferService,
    private tasksServices: TasksService,
    private activityServices: ActivityService,
    private userService : UserService,
    private messageService: MessageService,
  ) {
    this.editActivityForm = this.formBuilder.group({
      nomeAtividade: ['', Validators.required],
      descricao: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      status: ['', Validators.required],
      idUsuario: ['', Validators.required],
      idProjeto: ['', Validators.required]
    });
    this.userData;
    this.projectData;
  }

  ngOnInit(): void {
    this.status = [
      { name: 'CONCLUIDO', code: 'CONCLUIDO' },
      { name: 'EM_ANDAMENTO', code: 'EM_ANDAMENTO' },
      { name: 'ABERTA', code: 'ABERTA' },
      { name: 'PAUSADA', code: 'PAUSADA' }
    ];
    if (this.activityId) {
      this.loadProjectData();
      this.getUsersDatas();
      this.getTaskDatas();
      this.activityData.dataInicio = this.convertToDate(this.activityData.dataInicio);
      this.activityData.dataFim = this.convertToDate(this.activityData.dataFim);
    }else {
      console.log('Nenhum ID de projeto fornecido.');
    }
    console.log("ID do usuário:", this.activityData.usuarioResponsavel.id_usuarios);
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
    console.log('Formulário enviado', this.editActivityForm.value);
    if (this.editActivityForm.valid && this.activityId ) {
      const activityData: EditActivityRequest = {
        nomeAtividade: this.editActivityForm.value.nomeProjeto,
        descricao_atividade: this.editActivityForm.value.descricao,
        dataInicio: this.editActivityForm.value.dataInicio,
        dataFim: this.editActivityForm.value.dataFim,
        status: this.editActivityForm.value.status,
        idUsuario: this.editActivityForm.value.idUsuario,
        idProjeto: this.editActivityForm.value.idProjeto
      };
      console.log('Chamando tasksServices.createTask...');
      this.activityServices.editActivity(activityData, this.activityId )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.close();
            console.log('Chamando messageService.add() com sucesso...');
            console.log('Mensagem de sucesso:', {
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Atividade editada com sucesso!',
              life: 2000
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Atividade editada com sucesso!',
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
    console.log('Carregando projeto com ID:', this.activityId);
    this.activityServices.getActivityById(this.activityId ?? 0).subscribe({
      next: (data) => {
        console.log('Dados do projeto recebidos:', data);
        this.activityData = data;
        this.activityData.dataInicio = this.convertToDate(this.activityData.dataInicio);
        this.activityData.dataFim = this.convertToDate(this.activityData.dataFim);
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

  getTaskDatas(): void {
    this.tasksServices
      .getAllTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Resposta da API de usuários:', response);
          if (response.length > 0) {
            this.tasksList = response; // Armazena a lista de usuários retornados

            this.projeto = response.map(projeto => ({
              nomeProjeto: projeto.nomeProjeto,
              id_projeto: projeto.id_projeto
            }));

            console.log('Usuários carregados:', this.projeto); // Log da lista de usuários carregados
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
          });
        }
      }
    );
  }
}
