import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import {CriacaoProjetoComponent} from './criacao-projeto/criacao-projeto.component'
import { TasksDataTransferService } from 'src/app/shared/services/tasks/tasks-data-transfer.service';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { ViewProjectComponent } from "./view-project/view-project.component";
import { EditProjectComponent } from './edit-project/edit-project.component';
import { SearchService } from 'src/app/service/tasks/search.service';
import * as moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { UserService } from 'src/app/service/user/User.service';


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
  imports: [
    CommonModule,
    MenuModule,
    CriacaoProjetoComponent,
    ViewProjectComponent,
    EditProjectComponent
  ],
  styleUrls: ['./projetos.component.css']
})
export class ProjetosComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  private allTasks: GetAllTasksResponse[] = []; // Armazene todos os projetos
  public tasksList: GetAllTasksResponse[] = [];
  public selectedProjectId: number | null = null;
  @Input() searchTerm: string = '';
  @Input() userId: number | null = null;
  public userData: any = {}
  // Propriedades de paginação
  public currentPage = 1;
  public pageSize = 5; // Defina o tamanho da página desejado
  public totalItems = 0;


  constructor(
    private tasksDtService: TasksDataTransferService,
    private tasksServices: TasksService,
    private userService: UserService,
    private messageService: MessageService,
    private searchService: SearchService,
  ){}
  ngOnInit(): void {
    this.getUserIdFromToken();
    this.loadUserData();

    this.getTasksDatas()
    console.log("Id" + this.selectedProjectId);
    this.searchService.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.getTasksByName();
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
    this.isModalCreateOpen = true;  // Abre o modal
  }

  closeModalCreate() {
    this.isModalCreateOpen = false;  // Fecha o modal
    this.getTasksDatas()
  }

  openModalView(projectId: number) {
    this.selectedProjectId = projectId;
    this.isModalViewOpen = true;
    console.log(projectId);
  }

  closeModalView() {
    this.isModalViewOpen = false;  // Fecha o modal
  }

  openModalEdit(projectId: number) {
    this.selectedProjectId = projectId;
    this.isModalEditOpen = true;
  }

  closeModalEdit() {
    this.isModalEditOpen = false;
    this.getTasksDatas();
  }


  getTasksDatas(): void {
    this.tasksServices
      .getAllTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: GetAllTasksResponse[]) => {
          this.allTasks = response; // Armazene todos os projetos
          this.totalItems = response.length; // Atualize totalItems
          this.changePage(1); // Exiba a primeira página
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

  getTasksDatasByUserId(): void {
    this.tasksServices
      .getAllTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: GetAllTasksResponse[]) => {
          this.allTasks = response; // Armazene todos os projetos
          this.totalItems = response.length; // Atualize totalItems
          this.changePage(1); // Exiba a primeira página
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

  getTasksByName(): void {
    console.log('searchTerm:', this.searchTerm);
    console.log('userId:', this.userId);
    console.log('userData.perfil:', this.userData.perfil);

    if (this.searchTerm) {
      if (this.userData.perfil === 'ADMIN') {
        this.tasksServices
          .getProjectByName(this.searchTerm)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log('Resposta do serviço ADMIN:', response);
              if (response.length > 0) {
                this.tasksList = response;
                this.tasksDtService.setTasksDatas(this.tasksList);
              } else {
                this.tasksList = [];
              }
            },
          });
      } else if (this.userData.perfil === 'USUARIO') {
        this.tasksServices
          .getProjectsByNameAndUserId(this.searchTerm)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log('Resposta do serviço USUARIO:', response);
              if (response.length > 0) {
                this.tasksList = response;
                this.tasksDtService.setTasksDatas(this.tasksList);
              } else {
                this.tasksList = [];
              }
            },
          });
      }
    } else {
      if (this.userData.perfil === 'ADMIN') {
        this.getTasksDatas();
      } else if (this.userData.perfil === 'USUARIO') {
        this.getTasksDatasByUserId();
      }
    }
  }


  convertToDate(dateString: string | null): Date | null {
    if (!dateString) return null;

    console.log('Data recebida:', dateString);

    // Tente analisar a data no formato ISO 8601
    let date = moment(dateString, moment.ISO_8601, true);

    if (!date.isValid()) {
      // Se falhar, tente analisar a data no formato DD/MM/YYYY
      const format = 'DD/MM/YYYY';
      date = moment(dateString, format, true);

      if (!date.isValid()) {
        console.warn('Erro ao converter data:', dateString);
        return null;
      }
    }

    return date.toDate();
  }

  getUserIdFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken: any = jwtDecode(token);
            this.userId = decodedToken.sub;
            console.log("ID do usuario extraido do token: ", this.userId);
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
            console.error('Token problemático:', token);
        }
    } else {
        console.error('Token não encontrado no localStorage.');
    }
  }

  loadUserData() {
    console.log('Carregando projeto com ID:', this.userId);
    this.userService.getUsersById(this.userId ?? 0).subscribe({
      next: (data) => {
        console.log('Dados do usuario recebido:', data);
        this.userData = data;
      },
      error: (err) => {
        console.error('Erro ao carregar projeto:', err);
      }
    });
  }

  onSearchSubmitted(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.getTasksByName();
  }

  getStatusClass(status: string): any {
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

    // Métodos para controlar a paginação
  changePage(page: number): void {
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.tasksList = this.allTasks.slice(startIndex, endIndex); // Exiba apenas a página atual
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.pageSize);
    return Array(pageCount).fill(0).map((x, i) => i + 1);
  }

}
