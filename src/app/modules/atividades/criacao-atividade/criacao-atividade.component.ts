import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { CreateActivityRequest } from 'src/app/models/interfaces/atividades/CreateActivityRequest';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse';
import { ActivityService } from 'src/app/service/activity/activity.service';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { UserService } from 'src/app/service/user/User.service';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { TasksDataTransferService } from 'src/app/shared/services/tasks/tasks-data-transfer.service';

@Component({
  selector: 'app-criacao-atividade',
  templateUrl: './criacao-atividade.component.html',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    DropdownModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ToastModule
  ],
  styleUrls: ['./criacao-atividade.component.css']
})
export class CriacaoAtividadeComponent {
  private readonly destroy$: Subject<void> = new Subject();
  public activityList: Array<GetAllActivityResponse> = [];
  public userList: Array<GetAllUsersResponse> = [];
  public tasksList: Array<GetAllTasksResponse> = [];
  createActivityForm: FormGroup;
  value1: string | undefined;
  date2: Date | undefined;
  date3: Date | undefined;
  status: any[] = [];
  usuarios: any[] = [];
  projeto: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private usersDtService: UsersDataTransferService,
    private tasksDtService: TasksDataTransferService,
    private activityServices: ActivityService,
    private tasksServices: TasksService,
    private userService: UserService,
    private messageService: MessageService,
  ) {
    this.createActivityForm = this.formBuilder.group({
      nomeAtividade: ['', Validators.required],
      descricao: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      status: ['', Validators.required],
      idUsuario: ['', Validators.required],
      idProjeto: ['', Validators.required],
    });
  }

  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  selectedStatus: any;
  selectedUsuarios: any;
  selectedProjeto: any;

  ngOnInit() {
    this.getUsersDatas();
    this.getTasksEmAndamento(); // Modificado para buscar projetos em andamento
    this.status = [
      { name: 'CONCLUIDO', code: 'CONCLUIDO' },
      { name: 'EM_ANDAMENTO', code: 'EM_ANDAMENTO' },
      { name: 'ABERTA', code: 'ABERTA' },
      { name: 'PAUSADA', code: 'PAUSADA' }
    ];
  }

  onSubmit(): void {
    if (this.createActivityForm.valid) {
      const atividadeData: CreateActivityRequest = {
        nomeAtividade: this.createActivityForm.value.nomeAtividade,
        descricao_atividade: this.createActivityForm.value.descricao,
        dataInicio: this.createActivityForm.value.dataInicio,
        dataFim: this.createActivityForm.value.dataFim,
        status: this.createActivityForm.value.status,
        idUsuario: this.createActivityForm.value.idUsuario,
        idProjeto: this.createActivityForm.value.idProjeto
      };
      this.activityServices.createActivity(atividadeData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.close();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Atividade criada com sucesso!',
              life: 2000
            });
          },
          error: (err) => {
            if (err && err.error && err.error.message && err.error.message.includes("Apenas o responsável pelo projeto ou ADMINs pode criar atividades.")) {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro de Permissão',
                detail: 'Apenas o responsável pelo projeto ou ADMINs pode criar atividades!',
                life: 2000
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao criar a atividade!',
                life: 2000
              });
            }
            setTimeout(() => {
              new this.closeModal();
            }, 1000);
          }
        });
    }
  }

  getUsersDatas(): void {
    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.userList = response;
            this.usuarios = response.map(user => ({
              nome: user.nome,
              id_usuarios: user.id_usuarios
            }));
            this.usersDtService.setUsersDatas(this.userList);
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar os usuários!',
            life: 2500,
          });
        }
      });
  }

  getTasksEmAndamento(): void {
    this.tasksServices
      .getProjetosEmAndamento()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.tasksList = response;
            this.projeto = response.map(projeto => ({
              nomeProjeto: projeto.nomeProjeto,
              id_projeto: projeto.id_projeto
            }));
            this.tasksDtService.setTasksDatas(this.tasksList);
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar os projetos!',
            life: 2500,
          });
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
