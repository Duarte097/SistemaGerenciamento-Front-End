import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';
import { EditReleaseHoursRequest } from 'src/app/models/interfaces/lancamentoHoras/EditReleaseHoursRequest';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';
import { ActivityService } from 'src/app/service/activity/activity.service';
import { LancamentoHorasService } from 'src/app/service/lancamentoHoras/lancamento-horas.service';
import { UserService } from 'src/app/service/user/User.service';
import { ActivityDataTransferService } from 'src/app/shared/services/activity/activity-data-transfer.service';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';

@Component({
  selector: 'app-edit-lancamento-horas',
  templateUrl: './edit-lancamento-horas.component.html',
  standalone: true,
  imports: [
    CommonModule,
    InputTextareaModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule,
    ToastModule
  ],
  styleUrls: ['./edit-lancamento-horas.component.css']
})
export class EditLancamentoHorasComponent {
 private readonly destroy$: Subject<void> = new Subject();
  public activityList: Array<GetAllActivityResponse> = [];
  public userList: Array<GetAllUsersResponse> = [];
  @Output() closeModalEdit = new EventEmitter<void>();
  @Input() releaseHoursId: number | null = null;
  public releaseHoursData: any = {
    atividade: {
      idAtividade: null,
      nomeAtividade: null
    },
    user: {
      id_usuarios: null,
      nome: null
    },
  };
  public userData: any = {};
  public activityData: any = {};
  editReleaseHoursForm: FormGroup;
  selectedUsuarios: any;
  selectedAtividade: any;
  usuarios: any[] = [];
  atividade: any[] = [];



  constructor(
    private releaseHoursService: LancamentoHorasService,
    private formBuilder: FormBuilder,
    private usersDtService: UsersDataTransferService,
    private activityDtService: ActivityDataTransferService,
    private activityServices: ActivityService,
    private userService : UserService,
    private messageService: MessageService,
  ) {
    this.editReleaseHoursForm = this.formBuilder.group({
      descricao: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      dataLancamento: ['', Validators.required],
      idUsuario: ['', Validators.required],
      idAtividade: ['', Validators.required]
    });
    this.userData;
    this.activityData;
  }

  ngOnInit(): void {
    if (this.releaseHoursId) {
      this.loadReleaseHoursData();
      this.getUsersDatas();
      this.getActivityDatas();
    } else {
      console.log('Nenhum ID de projeto fornecido.');
    }
    console.log('formulario edit', this.editReleaseHoursForm);
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
    console.log('Formulário enviado', this.editReleaseHoursForm.value);
    if (this.editReleaseHoursForm.valid && this.releaseHoursId ) {
      const releaseHoursData: EditReleaseHoursRequest = {
        descricao: this.editReleaseHoursForm.value.descricao,
        dataInicio: this.editReleaseHoursForm.value.dataInicio ? format(this.editReleaseHoursForm.value.dataInicio, "yyyy-MM-dd'T'HH:mm:ss") : '',
        dataFim: this.editReleaseHoursForm.value.dataFim ? format(this.editReleaseHoursForm.value.dataFim, "yyyy-MM-dd'T'HH:mm:ss") : '',
        dataLancamento: this.editReleaseHoursForm.value.dataLancamento  ? format(this.editReleaseHoursForm.value.dataLancamento, "yyyy-MM-dd'T'HH:mm:ss") : '',
        idUsuario: this.editReleaseHoursForm.value.idUsuario,
        idAtividade: this.editReleaseHoursForm.value.idAtividade
      };
      console.log('Chamando tasksServices.createTask...');
      this.releaseHoursService.editReleaseHours(releaseHoursData, this.releaseHoursId )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.close();
            console.log('Chamando messageService.add() com sucesso...');
            console.log('Mensagem de sucesso:', {
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Lançamento de Horas editada com sucesso!',
              life: 2000
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Lançamento de Horas editada com sucesso!',
              life: 2000
            });

          },
          error: (err) => {
            console.log('Chamando messageService.add() com erro...');
            console.log('Mensagem de erro:', {
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar o Lançamento de Horas!',
              life: 2000
            });
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar o Lançamento de Horas!',
              life: 2000
            });
          }
        }
      );
    }
  }

  loadReleaseHoursData() {
    console.log('Carregando projeto com ID:', this.releaseHoursId);
    this.releaseHoursService.getReleaseHoursById(this.releaseHoursId ?? 0).subscribe({
      next: (data) => {
        console.log('Dados do projeto recebidos:', data);
        this.releaseHoursData = data;
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

  getActivityDatas(): void {
    this.activityServices
      .getAllActivity()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.activityList = response; // Armazena a lista de usuários retornados

            this.atividade = response.map(atividade => ({
              nomeAtividade: atividade.nomeAtividade,
              id_atividade: atividade.idAtividade
            }));

            this.activityDtService.setActivityDatas(this.activityList);
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar as Atividades!',
            life: 2500,
          });
        }
      }
    );
  }
}
