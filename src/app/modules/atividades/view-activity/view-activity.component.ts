import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ActivityService } from 'src/app/service/activity/activity.service';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  standalone: true,
  imports: [
    CommonModule,
    InputTextareaModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ToastModule
  ],
  styleUrls: ['./view-activity.component.css']
})
export class ViewActivityComponent {
  @Output() closeModalView = new EventEmitter<void>();
  @Input() activityId: number | null = null;

  public activityData: any = {
    projeto: {
      id_projetos: null,
      nomeProjeto: null
    },
    user: {
      id_usuarios: null,
      nome: null
    },
    dataInicio: null,
    dataFim: null
  };

  constructor(private activityServices: ActivityService) {}

  ngOnInit(): void {
    if (this.activityId) {
      this.loadActivityData();
    } else {
      console.log('Nenhum ID de projeto fornecido.');
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
    console.log('Carregando atividade com ID:', this.activityId);
    this.activityServices.getActivityById(this.activityId ?? 0).subscribe({
      next: (data) => {
        console.log('Dados da atividade recebidos:', data);

        // Atribui os dados recebidos ao objeto local
        this.activityData = data;

        // Converte as datas APÓS receber os dados
        this.activityData.dataInicio = this.convertToDate(this.activityData.dataInicio);
        this.activityData.dataFim = this.convertToDate(this.activityData.dataFim);
      },
      error: (err) => {
        console.error('Erro ao carregar atividade:', err);
      }
    });
  }
}
