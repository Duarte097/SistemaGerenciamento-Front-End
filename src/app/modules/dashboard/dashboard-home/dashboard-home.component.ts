import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { ActivityService } from 'src/app/service/activity/activity.service';
import { LancamentoHorasService } from 'src/app/service/lancamentoHoras/lancamento-horas.service';
import { Subject, takeUntil } from 'rxjs';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';
import { GetAllReleaseHoursResponse } from 'src/app/models/interfaces/lancamentoHoras/GetAllReleaseHoursResponse';
import { Chart, PieController, BarController, LineController, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';

Chart.register(PieController, BarController, LineController, ArcElement, CategoryScale, LinearScale, BarElement);

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

  @ViewChild('projetoChart') projetoChart!: ElementRef;
  @ViewChild('atividadeChart') atividadeChart!: ElementRef;
  @ViewChild('horasChart') horasChart!: ElementRef;

  constructor(
    private tasksService: TasksService,
    private activityService: ActivityService,
    private lancamentoHorasService: LancamentoHorasService
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  ngAfterViewInit(): void {
    this.criarGraficos();
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

    this.lancamentoHorasService.getAllReleaseHours().pipe(takeUntil(this.destroy$)).subscribe(lancamentos => {
      this.totalHorasLancadas = lancamentos.length;
      this.lancamentosRecentes = lancamentos.slice(0, 5).map(lancamento => {
        lancamento.totalHoras = this.calcularTotalHoras(lancamento.dataInicio, lancamento.dataFim);
        return lancamento;
      });
      this.totalHorasLancadasMes = this.lancamentosRecentes
        .filter(l => new Date(l.dataInicio).getMonth() === new Date().getMonth())
        .reduce((total, lancamento) => total + (lancamento.totalHoras || 0), 0);
    });
  }

  criarGraficos(): void {
    this.criarProjetoChart();
    this.criarAtividadeChart();
    this.criarHorasChart();
  }

  criarProjetoChart(): void {
    const ctx = this.projetoChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Concluídos', 'Em Andamento'],
        datasets: [{
          label: 'Projetos',
          data: [this.totalProjetosConcluidos, this.totalProjetos - this.totalProjetosConcluidos],
          backgroundColor: ['#007bff', '#6c757d']
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Projetos',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  criarAtividadeChart(): void {
    const ctx = this.atividadeChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Em Andamento', 'Concluídos'],
        datasets: [{
          label: 'Atividades',
          data: [this.totalAtividadesEmAndamento, this.totalAtividades - this.totalAtividadesEmAndamento],
          backgroundColor: ['#ff9800', '#28a745']
        }]
      }
    });
  }

  calcularTotalHoras(dataInicio: string, dataFim: string): number {
    const inicio = new Date(dataInicio).getTime();
    const fim = new Date(dataFim).getTime();
    const diff = fim - inicio;
    return diff / (1000 * 60 * 60);
  }

  criarHorasChart(): void {
    const ctx = this.horasChart.nativeElement.getContext('2d');
    const horasPorSemana = this.calcularHorasPorSemana();
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
          label: 'Horas Lançadas',
          data: horasPorSemana,
          backgroundColor: '#17a2b8'
        }]
      }
    });
  }

  calcularHorasPorSemana(): number[] {
    const lancamentosMes = this.lancamentosRecentes.filter(l => new Date(l.dataInicio).getMonth() === new Date().getMonth());
    const horasPorSemana = [0, 0, 0, 0];
    const hoje = new Date();
    const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const primeiroDiaDaSemana = primeiroDiaDoMes.getDay();

    lancamentosMes.forEach(lancamento => {
      const dataLancamento = new Date(lancamento.dataInicio);
      const diasDesdePrimeiroDia = Math.floor((dataLancamento.getTime() - primeiroDiaDoMes.getTime()) / (1000 * 60 * 60 * 24));
      const semana = Math.floor((diasDesdePrimeiroDia + primeiroDiaDaSemana) / 7);

      if (semana >= 0 && semana < 4) {
        horasPorSemana[semana] += lancamento.totalHoras || 0;
      }
    });

    return horasPorSemana;
  }

  getProgressBarItems(completed: number, total: number): any{
    const items : boolean[] = [];
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