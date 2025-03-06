import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';
import { GetAllReleaseHoursResponse } from 'src/app/models/interfaces/lancamentoHoras/GetAllReleaseHoursResponse';
import { ActivityService } from 'src/app/service/activity/activity.service';
import { LancamentoHorasService } from 'src/app/service/lancamentoHoras/lancamento-horas.service';
import { ActivityDataTransferService } from 'src/app/shared/services/activity/activity-data-transfer.service';
import { LancamentoHorasDataTransferService } from 'src/app/shared/services/lancamentoHoras/lancamento-horas-data-transfer.service';
import { CriacaoLancamentoHorasComponent } from "./criacao-lancamento-horas/criacao-lancamento-horas.component";
import { ViewLancamentoHorasComponent } from './view-lancamento-horas/view-lancamento-horas.component'
import { EditLancamentoHorasComponent } from "./edit-lancamento-horas/edit-lancamento-horas.component";
import { UserService } from 'src/app/service/user/User.service';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse';

@Component({
  selector: 'app-lancamento-horas',
  templateUrl: './lancamento-horas.component.html',
  standalone: true,
  imports: [
    CommonModule,
    CriacaoLancamentoHorasComponent,
    ViewLancamentoHorasComponent,
    EditLancamentoHorasComponent
],
  styleUrls: ['./lancamento-horas.component.css']
})
export class LancamentoHorasComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public releaseHoursList: Array<GetAllReleaseHoursResponse> = [];
  public activityList: Array<GetAllActivityResponse> = [];
  public userList: Array<GetAllUsersResponse> = [];
  //navbarData = navbarData;
  atividade: any[] = [];
  usuarios: any[] = [];
  public selectedReleaseHoursId: number | null = null;
  @Input() searchTerm: string = '';
  public releaseHoursData: any = {
    atividade: {
      idAtividade: null,
      nomeAtividade: null
    },
    user: {
      id_usuarios: null,
      nome: null
    },
  }


  constructor(
    private activityServices: ActivityService,
    private activityDtService: ActivityDataTransferService,
    private userService : UserService,
    private usersDtService: UsersDataTransferService,
    private releaseHoursDtService: LancamentoHorasDataTransferService,
    private releaseHoursServices: LancamentoHorasService,
    private messageService: MessageService,
    //private searchService: SearchService,
  ){}
  ngOnInit(): void {
    this.getReleaseHoursDatas()
    this.getActivityDatas()
    this.getUsersDatas();
    /*this.searchService.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.getTasksByName();
    });*/
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isModalCreateOpen = false;
  isModalViewOpen = false;
  isModalEditOpen = false;

  openModalCreate() {
    this.isModalCreateOpen = true;  // Abre o modal
  }

  closeModalCreate() {
    this.isModalCreateOpen = false;  // Fecha o modal
    this.getReleaseHoursDatas()
  }

  openModalView(releaseHoursId: number) {
    this.selectedReleaseHoursId = releaseHoursId;
    this.isModalViewOpen = true;
    console.log(releaseHoursId);
  }

  closeModalView() {
    this.isModalViewOpen = false;  // Fecha o modal
  }

  openModalEdit(releaseHoursId: number) {
    this.selectedReleaseHoursId = releaseHoursId;
    this.isModalEditOpen = true;
  }

  closeModalEdit() {
    this.isModalEditOpen = false;
    this.getReleaseHoursDatas();
  }


  getReleaseHoursDatas(): void {
    this.releaseHoursServices
    .getAllReleaseHours()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        if(response.length > 0) {
          this.releaseHoursList = response
          this.releaseHoursData = response.length > 0 ? response[0] : {};
          console.log(this.releaseHoursList);
          this.releaseHoursDtService.setReleaseHoursDatas(this.releaseHoursList);
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar as atividades!',
          life: 2500,
        })
      }
    })
  }

  /*getTasksByName(): void {
    if (this.searchTerm) {
      this.tasksServices
      .getProjectByName(this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.tasksList = response;
            this.tasksDtService.setTasksDatas(this.tasksList);
          } else {
            this.tasksList = [];
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar projetos!',
            life: 2500,
          });
        },
      });
    } else {
        this.getTasksDatas(); // Se searchTerm estiver vazio, busca todos os projetos
    }
  }*/

  getActivityDatas(): void {
    this.activityServices
      .getAllActivity()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Resposta da API de usuários:', response);
          if (response.length > 0) {
            this.activityList = response; // Armazena a lista de usuários retornados

            this.atividade = response.map(atividade => ({
              idAtividade: atividade.idAtividade,
              nomeAtividade: atividade.nomeAtividade
            }));

            console.log('Atividades carregadas:', this.atividade); // Log da lista de usuários carregados
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
