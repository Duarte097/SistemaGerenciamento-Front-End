import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';
import { GetAllReleaseHoursResponse } from 'src/app/models/interfaces/lancamentoHoras/GetAllReleaseHoursResponse';
import { ActivityService } from 'src/app/service/activity/activity.service';
import { LancamentoHorasService } from 'src/app/service/lancamentoHoras/lancamento-horas.service';
import { ActivityDataTransferService } from 'src/app/shared/services/activity/activity-data-transfer.service';
import { LancamentoHorasDataTransferService } from 'src/app/shared/services/lancamentoHoras/lancamento-horas-data-transfer.service';

@Component({
  selector: 'app-lancamento-horas',
  templateUrl: './lancamento-horas.component.html',
  standalone: true,
  imports: [
    CommonModule
  ],
  styleUrls: ['./lancamento-horas.component.css']
})
export class LancamentoHorasComponent {
private readonly destroy$: Subject<void> = new Subject();
  public releaseHoursList: Array<GetAllReleaseHoursResponse> = [];
  public activityList: Array<GetAllActivityResponse> = [];
  //navbarData = navbarData;
  public selectedActivityId: number | null = null;
  @Input() searchTerm: string = '';
  public releaseHoursData: any = {
    atividade: {
      id_atividade: null,
      nomeAtividade: null
    }
  }


  constructor(
    private activityServices: ActivityService,
    private activityDtService: ActivityDataTransferService,
    private releaseHoursDtService: LancamentoHorasDataTransferService,
    private releaseHoursServices: LancamentoHorasService,
    private messageService: MessageService,
    //private searchService: SearchService,
  ){}
  ngOnInit(): void {
    this.getReleaseHoursDatas()
    console.log("Id" + this.selectedActivityId);
    /*this.searchService.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.getTasksByName();
    });*/
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
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

  openModalView(activityId: number) {
    this.selectedActivityId = activityId;
    this.isModalViewOpen = true;
    console.log(activityId);
  }

  closeModalView() {
    this.isModalViewOpen = false;  // Fecha o modal
  }

  openModalEdit(activityId: number) {
    this.selectedActivityId = activityId;
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
          this.releaseHoursData = response
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

  convertToDate(dateString: string): Date {
    const parts = dateString.split('/');
    if (parts.length !== 3) return new Date(); // Retorna uma data padrão se o formato estiver errado

    const [day, month, year] = parts.map(Number); // Converte para números
    return new Date(year, month - 1, day); // O mês em JavaScript começa do 0
  }

}
