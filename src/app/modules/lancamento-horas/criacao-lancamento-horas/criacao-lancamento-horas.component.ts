import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GetAllReleaseHoursResponse } from 'src/app/models/interfaces/lancamentoHoras/GetAllReleaseHoursResponse';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';
import { LancamentoHorasService } from 'src/app/service/lancamentoHoras/lancamento-horas.service';
import { UserService } from 'src/app/service/user/User.service';
import { MessageService } from 'primeng/api';
import { CreateReleaseHoursRequest } from 'src/app/models/interfaces/lancamentoHoras/CreateReleaseHoursRequest';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { TasksDataTransferService } from 'src/app/shared/services/tasks/tasks-data-transfer.service';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';
import { ActivityService } from 'src/app/service/activity/activity.service';
import { ActivityDataTransferService } from 'src/app/shared/services/activity/activity-data-transfer.service';

@Component({
  selector: 'app-criacao-lancamento-horas',
  templateUrl: './criacao-lancamento-horas.component.html',
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
  styleUrls: ['./criacao-lancamento-horas.component.css']
})
export class CriacaoLancamentoHorasComponent {
  private readonly destroy$: Subject<void> = new Subject();
  public releaseHoursList: Array<GetAllReleaseHoursResponse> = [];
  public userList: Array<GetAllUsersResponse> = [];
  public activityList: Array<GetAllActivityResponse> = [];
  createReleaseHoursForm: FormGroup;
  value1: string | undefined;
  date2: Date | undefined;
  date3: Date | undefined;
  status: any[] = [];
  usuarios: any[] = [];
  atividade: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private usersDtService: UsersDataTransferService,
    private releaseHoursServices: LancamentoHorasService,
    private userService : UserService,
    private activityServices: ActivityService,
    private activityDtService: ActivityDataTransferService,
    private messageService: MessageService,
  ){
    this.createReleaseHoursForm = this.formBuilder.group({
      descricao: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      idUsuario: ['', Validators.required],
      idAtividade: ['', Validators.required]
    });
  }


  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();  // Emite um evento para o componente pai fechar o modal
  }

  selectedStatus: any;
  selectedUsuarios: any;
  selectedAtividade: any;


  ngOnInit() {
    this.getUsersDatas()
    this.getActivityDatas()
  }

  onSubmit(): void {
    console.log('Formulário enviado', this.createReleaseHoursForm.value);
    if (this.createReleaseHoursForm.valid) {
      const releaseHoursData: CreateReleaseHoursRequest = {
        descricao: this.createReleaseHoursForm.value.descricao,
        dataInicio: this.createReleaseHoursForm.value.dataInicio,
        dataFim: this.createReleaseHoursForm.value.dataFim,
        idUsuario: this.createReleaseHoursForm.value.idUsuario,
        idAtividade: this.createReleaseHoursForm.value.idAtividade
      };
      console.log('Chamando tasksServices.createTask...');
      this.releaseHoursServices.createReleaseHours(releaseHoursData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.close();
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

  getActivityDatas(): void {
    this.activityServices
      .getAllActivity()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Resposta da API de usuários:', response);
          if (response.length > 0) {
            this.activityList = response; // Armazena a lista de usuários retornados

            this.atividade = response.map(projeto => ({
              nomeAtividade: projeto.nomeAtividade,
              id_atividade: projeto.id_atividade
            }));

            console.log('Usuários carregados:', this.atividade); // Log da lista de usuários carregados
            this.activityDtService.setActivityDatas(this.activityList);
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
