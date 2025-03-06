import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Subject, takeUntil } from 'rxjs';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';
import { ActivityService } from 'src/app/service/activity/activity.service';
import { ActivityDataTransferService } from 'src/app/shared/services/activity/activity-data-transfer.service';
import { CriacaoAtividadeComponent } from "./criacao-atividade/criacao-atividade.component";
import { EditActivityComponent } from "./edit-activity/edit-activity.component";
import { ViewActivityComponent } from "./view-activity/view-activity.component";


@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MenuModule,
    CriacaoAtividadeComponent,
    EditActivityComponent,
    ViewActivityComponent
],
  styleUrls: ['./atividades.component.css']
})
export class AtividadesComponent implements OnInit, OnDestroy {
private readonly destroy$: Subject<void> = new Subject();
  public activityList: Array<GetAllActivityResponse> = [];
  //navbarData = navbarData;
  public selectedActivityId: number | null = null;
  @Input() searchTerm: string = '';


  constructor(
    private activityDtService: ActivityDataTransferService,
    private activityServices: ActivityService,
    private messageService: MessageService,
    //private searchService: SearchService,
  ){}
  ngOnInit(): void {
    this.getActivityDatas()
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
    this.getActivityDatas()
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
    this.getActivityDatas();
  }


  getActivityDatas(): void {
    this.activityServices
    .getAllActivity()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        if(response.length > 0) {
          this.activityList = response
          this.activityDtService.setActivityDatas(this.activityList);
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


  getStatusClass(status: string): any {
    console.log('Status recebido:', status);
    switch (status.trim()) {
      case 'CONCLUIDO':
        return { 'bg-green-500': true, 'text-green-700': true, 'border-green-700': true };
      case 'EM_ANDAMENTO':
        return { 'bg-blue-500': true, 'text-blue-700': true, 'border-blue-700': true };
      case 'ABERTA':
        return { 'bg-orange-500': true, 'text-orange-700': true, 'border-orange-700': true };
      case 'PAUSADA':
        return { 'bg-yellow-500': true, 'text-yellow-700': true, 'border-yellow-700': true };
      default:
        return { 'bg-blue-500': true, 'text-blue-700': true, 'border-gray-500': true };
    }
  }


  getStatusIcon(status: string): string {
    switch (status) {
      case 'CONCLUIDO':
        return 'pi pi-check-circle text-green-600'; // Ícone de check para concluído ✅
      case 'EM_ANDAMENTO':
        return 'pi pi-spin pi-spinner text-blue-600'; // Ícone de carregamento para andamento 🔄
      case 'ABERTA':
        return 'pi pi-lock-open text-red-600'; // icone de cadeado para aberto 🔑
      case 'PAUSADA':
        return 'pi pi-stop-circle text-gray-600'; // Ícone de pausa para pausado 🛑
      default:
        return 'pi pi-question-circle text-gray-500'; // Ícone de interrogação para status desconhecido ❓
    }
  }


  getStatusBorderClass(status: string): any {
    return { 'border-green-200': status === 'CONCLUIDO', 'border-yellow-200': status === 'EM_ANDAMENTO', 'border-red-200': status === 'ABERTA', 'border-gray-200': status === 'PAUSADA' };
  }

  getTextColorClass(status: string): any {
    return { 'text-green-700': status === 'CONCLUIDO', 'text-yellow-700': status === 'EM_ANDAMENTO', 'text-red-700': status === 'ABERTA', 'text-gray-700': status === 'PAUSADA' };
  }

  getBadgeClass(status: string): any {
    return { 'bg-green-400 text-green-900': status === 'CONCLUIDO', 'bg-yellow-400 text-yellow-900': status === 'EM_ANDAMENTO', 'bg-red-400 text-red-900': status === 'ABERTA', 'bg-gray-400 text-gray-900': status === 'PAUSADA' };
  }

}
