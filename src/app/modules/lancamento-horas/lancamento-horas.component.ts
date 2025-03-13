import { animate } from '@angular/animations';
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
import { CriacaoLancamentoHorasComponent } from './criacao-lancamento-horas/criacao-lancamento-horas.component';
import { ViewLancamentoHorasComponent } from './view-lancamento-horas/view-lancamento-horas.component';
import { EditLancamentoHorasComponent } from './edit-lancamento-horas/edit-lancamento-horas.component';
import { UserService } from 'src/app/service/user/User.service';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse';
import { SearchService } from 'src/app/service/tasks/search.service';

@Component({
  selector: 'app-lancamento-horas',
  templateUrl: './lancamento-horas.component.html',
  standalone: true,
  imports: [
    CommonModule,
    CriacaoLancamentoHorasComponent,
    ViewLancamentoHorasComponent,
    EditLancamentoHorasComponent,
  ],
  styleUrls: ['./lancamento-horas.component.css'],
})
export class LancamentoHorasComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public releaseHoursList: GetAllReleaseHoursResponse[] = [];
  private allreleaseHours: GetAllReleaseHoursResponse[] = [];
  public activityList: Array<GetAllActivityResponse> = [];
  public userList: Array<GetAllUsersResponse> = [];
  public activityData: any = {};
  atividade: any[] = [];
  usuarios: any[] = [];

  public currentPage = 1;
  public pageSize = 5; // Defina o tamanho da página desejado
  public totalItems = 0;

  public selectedReleaseHoursId: number | null = null;
  @Input() searchTerm: string = '';
  public activityId: number | string | null = null;
  public releaseHoursData: any = {
    atividade: {
      idAtividade: null,
      nomeAtividade: null
    },
  };

  constructor(
    private activityServices: ActivityService,
    private activityDtService: ActivityDataTransferService,
    private userService: UserService,
    private usersDtService: UsersDataTransferService,
    private releaseHoursDtService: LancamentoHorasDataTransferService,
    private releaseHoursServices: LancamentoHorasService,
    private messageService: MessageService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getReleaseHoursDatas();
    this.getActivityDatas();
    this.getUsersDatas();
    this.searchService.searchTerm$
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.getReleaseHoursByName();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isModalCreateOpen = false;
  isModalViewOpen = false;
  isModalEditOpen = false;

  openModalCreate() {
    this.isModalCreateOpen = true; // Abre o modal
  }

  closeModalCreate() {
    this.isModalCreateOpen = false; // Fecha o modal
    this.getReleaseHoursDatas();
  }

  openModalView(releaseHoursId: number) {
    this.selectedReleaseHoursId = releaseHoursId;
    this.isModalViewOpen = true;
    console.log(releaseHoursId);
  }

  closeModalView() {
    this.isModalViewOpen = false; // Fecha o modal
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
        next: (response: GetAllReleaseHoursResponse[]) => {
          this.allreleaseHours = response;
          this.releaseHoursList = response;
          console.log("Release Hours List:", this.releaseHoursList);
          this.releaseHoursData = response.length > 0 ? response[0] : {};
          console.log("Informações que vieram do lancamento de horas", response);
          this.totalItems = response.length;
          this.changePage(1);
          this.releaseHoursDtService.setReleaseHoursDatas(
            this.releaseHoursList
          );
          if (this.releaseHoursList.length > 0) {
            const firstActivityId = this.releaseHoursList[0].atividade.id_atividade;
            console.log("ID da atividade:", firstActivityId);

            if (firstActivityId) {
              this.loadActivityData(firstActivityId);
            }
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar as atividades!',
            life: 2500,
          });
        },
      });
  }

  getReleaseHoursByName(): void {
    if (this.searchTerm) {
      this.releaseHoursServices
        .getReleaseHoursByName(this.searchTerm)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.length > 0) {
              this.releaseHoursList = response;
              this.releaseHoursDtService.setReleaseHoursDatas(
                this.releaseHoursList
              );
            } else {
              this.releaseHoursList = [];
            }
          },
        });
    } else {
      this.getReleaseHoursDatas(); // Se searchTerm estiver vazio, busca todos os projetos
    }
  }

  loadActivityData(activityId: any): void {
    console.log("id da atividade", activityId);
    if (activityId) {
        this.activityServices.getActivityById(activityId).subscribe({
            next: (data) => {
                console.log('Dados da atividade recebidos:', data);
                this.activityData = data;
            },
            error: (err) => {
                console.error('Erro ao carregar a atividade', err);
            }
        });
    } else {
        this.activityData = {}; // Ou outra inicialização adequada
    }
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

            this.atividade = response.map((atividade) => ({
              idAtividade: atividade.id_atividade,
              nomeAtividade: atividade.nomeAtividade,
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
            detail: 'Erro ao buscar os usuários!',
            life: 2500,
          });
        },
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

            this.usuarios = response.map((user) => ({
              nome: user.nome,
              id_usuarios: user.id_usuarios,
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
        },
      });
  }

  onSearchSubmitted(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.getReleaseHoursByName();
  }

  changePage(page: number): void {
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.releaseHoursList = this.allreleaseHours.slice(startIndex, endIndex); // Exiba apenas a página atual
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.pageSize);
    return Array(pageCount)
      .fill(0)
      .map((x, i) => i + 1);
  }
}
