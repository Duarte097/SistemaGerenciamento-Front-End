import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { navbarData } from '../toolbar-navigation/nav-data';

interface Projetos {
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  status: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
}

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  standalone: true,
  imports: [CommonModule, MenuModule],
  styleUrls: ['./projetos.component.css']
})
export class ProjetosComponent {
  navbarData = navbarData;
  projetos: Projetos[] = [
    { nome: 'Front-End da Empresa X', descricao: "Desenvolver o Front-end", dataInicio: new Date(2020, 9, 10), dataFim: new Date(2021, 9, 10), status: 'PLANEJADO'},
    { nome: 'Front-End da Empresa Y', descricao: "Desenvolver o Front-end", dataInicio: new Date(2020, 9, 10), dataFim: new Date(2021, 10, 21), status: 'EM_ANDAMENTO' },
    { nome: 'Front-End da Empresa E', descricao: "Desenvolver o Front-end", dataInicio: new Date(2020, 9, 10), dataFim: new Date(2021, 12, 20), status: 'CONCLUIDO' },
    { nome: 'Front-End da Empresa D', descricao: "Desenvolver o Front-end", dataInicio: new Date(2020, 9, 10), dataFim: new Date(2021, 5, 1), status: 'CANCELADO' },
  ];

  getStatusClass(status: string): any {
    switch (status) {
      case 'CONCLUIDO':
        return { 'bg-green-500': true, 'text-white': true, 'border-green-700': true };
      case 'EM_ANDAMENTO':
        return { 'bg-blue-500': true, 'text-white': true, 'border-blue-700': true };
      case 'CANCELADO':
        return { 'bg-red-500': true, 'text-white': true, 'border-red-700': true };
      case 'PLANEJADO':
        return { 'bg-gray-500': true, 'text-white': true, 'border-gray-700': true };
      default:
        return { 'bg-gray-300': true, 'text-white': true, 'border-gray-500': true };
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
