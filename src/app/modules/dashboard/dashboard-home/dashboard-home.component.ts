import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { ActivityService } from 'src/app/service/activity/activity.service';
import { LancamentoHorasService } from 'src/app/service/lancamentoHoras/lancamento-horas.service';
import { Subject, takeUntil } from 'rxjs';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';
import { GetAllReleaseHoursResponse } from 'src/app/models/interfaces/lancamentoHoras/GetAllReleaseHoursResponse';
import { CalendarModule } from 'primeng/calendar';
import { Chart, PieController, BarController, LineController, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';

Chart.register(PieController, BarController, LineController, ArcElement, CategoryScale, LinearScale, BarElement);

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  standalone: true,
  imports: [CommonModule, CalendarModule],
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

  private projetoChartInstance: Chart | null = null;

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
    //this.criarGraficos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarDados(): void {
    this.tasksService.getAllTasks().pipe(takeUntil(this.destroy$)).subscribe(projetos => {
      console.log('Projetos recebidos da API:', projetos); // Adicionado console.log
      this.totalProjetos = projetos.length;
      const projetosConcluidos = projetos.filter(p => p.status === 'CONCLUIDO');
      console.log('Projetos concluídos:', projetosConcluidos); // Adicionado console.log
      this.totalProjetosConcluidos = projetosConcluidos.length;
      this.projetosRecentes = projetos.slice(0, 5);
      this.criarProjetoChart();
    });

    this.activityService.getAllActivity().pipe(takeUntil(this.destroy$)).subscribe(atividades => {
      this.totalAtividades = atividades.length;
      this.totalAtividadesEmAndamento = atividades.filter(a => a.status === 'EM_ANDAMENTO').length;
      this.atividadesRecentes = atividades.slice(0, 5);
      this.criarAtividadeChart();
    });

    this.lancamentoHorasService.getAllReleaseHours().pipe(takeUntil(this.destroy$)).subscribe(lancamentos => {
      console.log('Lançamentos da API:', lancamentos);
      this.totalHorasLancadas = lancamentos.length;
      this.lancamentosRecentes = lancamentos.slice(0, 5).map(lancamento => {
        lancamento.totalHoras = this.calcularTotalHoras(lancamento.dataInicio, lancamento.dataFim);
        return lancamento;
      });
      console.log('Lançamentos recentes:', this.lancamentosRecentes);
      this.totalHorasLancadasMes = this.lancamentosRecentes
        .filter(l => new Date(l.dataInicio).getMonth() === new Date().getMonth())
        .reduce((total, lancamento) => total + (lancamento.totalHoras || 0), 0);
        this.criarHorasChart();
    });
    console.log('Lançamentos recentes:', this.lancamentosRecentes);
  }


  criarProjetoChart(): void {
    console.log('Dados para o gráfico de projetos:', this.totalProjetosConcluidos, this.totalProjetos - this.totalProjetosConcluidos); // Adicionado console.log
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
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                let value = context.raw || 0;
                return `${label}: ${value}`;
              }
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
    const [inicioHoras, inicioMinutos] = dataInicio.split(':').map(Number);
    const [fimHoras, fimMinutos] = dataFim.split(':').map(Number);

    const inicio = new Date();
    const fim = new Date();

    inicio.setHours(inicioHoras, inicioMinutos, 0, 0);
    fim.setHours(fimHoras, fimMinutos, 0, 0);

    const diff = fim.getTime() - inicio.getTime();

    return Math.round(diff / (1000 * 60 * 60)); // Retorna a diferença em horas
  }



  criarHorasChart(): void {
    if (this.projetoChartInstance) {
        this.projetoChartInstance.destroy();
    }

    const ctx = this.horasChart.nativeElement.getContext('2d');
    const horasPorSemana = this.calcularHorasPorSemana();

    // Verifica se há horas para exibir
    if (horasPorSemana.every(h => h === 0)) {
        console.error('Não há horas para exibir no gráfico.'); // Debug
        return; // Se não há horas, não prosseguir
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [{
                label: 'Horas Lançadas',
                data: horasPorSemana,
                backgroundColor: '#17a2b8'
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Horas Lançadas por Semana',
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

  calcularHorasPorSemana(): number[] {
    const horasPorSemana = [0, 0, 0, 0]; // Inicializa as horas por semana
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    this.lancamentosRecentes.forEach(lancamento => {
        // Converte a dataLancamento para o formato correto
        const dataLancamentoParts = lancamento.dataLancamento.split('/');
        const dataLancamento = new Date(`${dataLancamentoParts[2]}-${dataLancamentoParts[1]}-${dataLancamentoParts[0]}`);

        if (dataLancamento.getMonth() === mesAtual && dataLancamento.getFullYear() === anoAtual) {
            const diaDoMes = dataLancamento.getDate();
            const semana = Math.floor((diaDoMes - 1) / 7); // Calcula qual semana do mês

            horasPorSemana[semana] += lancamento.totalHoras; // Acumula totalHoras
        }
    });

    console.log('Horas por semana:', horasPorSemana); // log para debug
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

  parseHoraParaDate(hora: string): Date {
    const hoje = new Date(); // use the current date
    const [horas, minutos] = hora.split(':').map(Number);

    // Create a new date object with today’s date combined with your hour and minute values
    hoje.setHours(horas);
    hoje.setMinutes(minutos);
    hoje.setSeconds(0);
    hoje.setMilliseconds(0);

    return hoje; // return the complete date object
  }

  onMesSelecionado(event: any) {
    const [ano, mes] = event.target.value.split('-').map(Number);
    this.filtrarLancamentosPorMes(mes - 1, ano);
  }

  filtrarLancamentosPorMes(mes: number, ano: number) {
    const lancamentos = this.lancamentosRecentes.filter(l => {
      const data = new Date(l.dataInicio);
      return data.getMonth() === mes && data.getFullYear() === ano;
    });
    console.log('Lançamentos no mês:', lancamentos);
  }



}