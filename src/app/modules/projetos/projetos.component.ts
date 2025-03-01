import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { navbarData } from './nav-data';
import {CriacaoProjetoComponent} from './criacao-projeto/criacao-projeto.component'
import { TasksDataTransferService } from 'src/app/shared/services/tasks/tasks-data-transfer.service';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';

interface Projetos {
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  prioridade: 'ALTA' | 'BAIXA' | 'MÉDIA';
  status: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
}

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  standalone: true,
  imports: [CommonModule, MenuModule, CriacaoProjetoComponent],
  styleUrls: ['./projetos.component.css']
})
export class ProjetosComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public tasksList: Array<GetAllTasksResponse> = [];
  navbarData = navbarData;

  constructor(
    private tasksDtService: TasksDataTransferService,
    private tasksServices: TasksService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router,
  ){}
  ngOnInit(): void {
    this.getTasksDatas()

  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;  // Abre o modal
  }

  closeModal() {
    this.isModalOpen = false;  // Fecha o modal
  }



  getTasksDatas(): void {
    this.tasksServices
    .getAllTasks()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        if(response.length > 0) {
          this.tasksList = response
          this.tasksDtService.setTasksDatas(this.tasksList);
          console.log(response);
          console.log(this.tasksList);
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos!',
          life: 2500,
        })
      }
    })
  }

  convertToDate(dateString: string): Date {
    const parts = dateString.split('/');
    if (parts.length !== 3) return new Date(); // Retorna uma data padrão se o formato estiver errado

    const [day, month, year] = parts.map(Number); // Converte para números
    return new Date(year, month - 1, day); // O mês em JavaScript começa do 0
  }


  getStatusClass(status: string): any {
    console.log("Status:", status);
    switch (status) {
      case 'CONCLUIDO':
        return { 'bg-green-500': true, 'text-green-700': true, 'border-green-700': true };
      case 'EM_ANDAMENTO':
        return { 'bg-blue-500': true, 'text-blue-700': true, 'border-blue-700': true };
      case 'CANCELADO':
        return { 'bg-red-500': true, 'text-red-700': true, 'border-red-700': true };
      case 'PLANEJADO':
        return { 'bg-gray-500': true, 'text-gray-700': true, 'border-gray-700': true };
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
      case 'CANCELADO':
        return 'pi pi-times-circle text-red-600'; // Ícone de X para cancelado ❌
      case 'PLANEJADO':
        return 'pi pi-calendar text-gray-600'; // Ícone de calendário para planejado 📅
      default:
        return 'pi pi-question-circle text-gray-500'; // Ícone de interrogação para status desconhecido ❓
    }
  }


  getStatusBorderClass(status: string): any {
    return { 'border-green-200': status === 'CONCLUIDO', 'border-yellow-200': status === 'EM_ANDAMENTO', 'border-red-200': status === 'CANCELADO', 'border-gray-200': status === 'PLANEJADO' };
  }

  getTextColorClass(status: string): any {
    return { 'text-green-700': status === 'CONCLUIDO', 'text-yellow-700': status === 'EM_ANDAMENTO', 'text-red-700': status === 'CANCELADO', 'text-gray-700': status === 'PLANEJADO' };
  }

  getBadgeClass(status: string): any {
    return { 'bg-green-400 text-green-900': status === 'CONCLUIDO', 'bg-yellow-400 text-yellow-900': status === 'EM_ANDAMENTO', 'bg-red-400 text-red-900': status === 'CANCELADO', 'bg-gray-400 text-gray-900': status === 'PLANEJADO' };
  }


}
