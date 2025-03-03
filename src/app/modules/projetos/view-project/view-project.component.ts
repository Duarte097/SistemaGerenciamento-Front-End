import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TasksService } from 'src/app/service/tasks/tasks.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {  DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
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
    ToastModule
  ],
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit{
  @Output() closeModalView = new EventEmitter<void>();
  @Input() projectId: number | null = null;
  public projectData: any = {
    usuarioResponsavel: {
      id_usuarios: null,
      nome: null
    }
  };
  value: string | undefined = "Disabled"

  constructor(private tasksService: TasksService) {}
  ngOnInit(): void {
    if (this.projectId) {
      this.loadProjectData();
      this.projectData.dataInicio = this.convertToDate(this.projectData.dataInicio);
      this.projectData.dataFim = this.convertToDate(this.projectData.dataFim);
    }else {
      console.log('Nenhum ID de projeto fornecido.');
    }

  }

  close() {
    this.closeModalView.emit();  // Emite um evento para o componente pai fechar o modal
  }

  convertToDate(dateString: string): Date | null {
    const date = moment(dateString, 'DD/MM/YYYY');
    if (date.isValid()) {
      return date.toDate();
    }
    return null;
  }

  loadProjectData() {
    console.log('Carregando projeto com ID:', this.projectId);
    this.tasksService.getProjectById(this.projectId ?? 0).subscribe({
      next: (data) => {
        console.log('Dados do projeto recebidos:', data);
        this.projectData = data;
      },
      error: (err) => {
        console.error('Erro ao carregar projeto:', err);
      }
    });
  }

}
