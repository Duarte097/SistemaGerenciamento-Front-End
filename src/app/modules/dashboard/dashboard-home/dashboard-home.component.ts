import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { ActivityService } from 'src/app/service/activity/activity.service';
import { LancamentoHorasService } from 'src/app/service/lancamentoHoras/lancamento-horas.service';
import { Subject, takeUntil } from 'rxjs';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';
import { GetAllReleaseHoursResponse } from 'src/app/models/interfaces/lancamentoHoras/GetAllReleaseHoursResponse';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  totalProjetos: number = 0;
  totalProjetosConcluidos: number = 0;
  totalAtividades: number = 0;
  totalAtividadesEmAndamento: number = 0;
  totalHorasLancadas: number = 0;
  totalHorasLancadasMes: number = 0;

  projetosRecentes: GetAllTasksResponse[] = [];
  atividadesRecentes: GetAllActivityResponse[] = [];
  lancamentosRecentes: GetAllReleaseHoursResponse[] = [];

  constructor(
    private tasksService: TasksService,
    private activityService: ActivityService,
    private lancamentoHorasService: LancamentoHorasService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarDados(): void {
    this.tasksService.getAllTasks().pipe(takeUntil(this.destroy$)).subscribe(projetos => {
      this.totalProjetos = projetos.length;
      this.totalProjetosConcluidos = projetos.filter(p => p.status === 'CONCLUIDO').length;
      this.projetosRecentes = projetos.slice(0, 5);
    });

    this.activityService.getAllActivity().pipe(takeUntil(this.destroy$)).subscribe(atividades => {
      this.totalAtividades = atividades.length;
      this.totalAtividadesEmAndamento = atividades.filter(a => a.status === 'EM_ANDAMENTO').length;
      this.atividadesRecentes = atividades.slice(0, 5);
    });


  }

  getProgressBarItems(completed: number, total: number): any[] {
    const items = [];
    for (let i = 0; i < total; i++) {
      if (i < completed) {
        items.push(true);
      } else {
        items.push(false);
      }
    }
    return items;
  }
}
