import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { LancamentoHorasService } from 'src/app/service/lancamentoHoras/lancamento-horas.service';
import { InputTextModule } from 'primeng/inputtext'
@Component({
  selector: 'app-view-lancamento-horas',
  templateUrl: './view-lancamento-horas.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    CommonModule,
    InputTextareaModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule
  ],
  styleUrls: ['./view-lancamento-horas.component.css']
})
export class ViewLancamentoHorasComponent {
  @Output() closeModalView = new EventEmitter<void>();
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
    dataInicio: null,
    dataFim: null
  };

  constructor(private releaseHoursServices: LancamentoHorasService) {}

  ngOnInit(): void {
    if (this.releaseHoursId) {
      this.loadActivityData();
    } else {
      console.log('Nenhum ID do lançamento fornecido.');
    }
  }

  close() {
    this.closeModalView.emit();
  }

  convertToDate(dateString: string): Date | null {
    if (!dateString) return null;
    const date = moment(dateString, 'DD/MM/YYYY', true); // O `true` força a validação estrita
    return date.isValid() ? date.toDate() : null;
  }

  loadActivityData() {
    console.log('Carregando atividade com ID:', this.releaseHoursId);
    this.releaseHoursServices.getReleaseHoursById(this. releaseHoursId ?? 0).subscribe({
      next: (data) => {
        console.log('Dados da atividade recebidos:', data);

        // Atribui os dados recebidos ao objeto local
        this.releaseHoursData = data;

        // Converte as datas APÓS receber os dados
        //this.releaseHoursData.dataInicio = this.convertToDate(this.releaseHoursData.dataInicio);
        //this.releaseHoursData.dataFim = this.convertToDate(this.releaseHoursData.dataFim);
      },
      error: (err) => {
        console.error('Erro ao carregar atividade:', err);
      }
    });
  }
}
