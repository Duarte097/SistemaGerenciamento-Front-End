import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { navbarData } from '../../toolbar-navigation/nav-data';

@Component({
  selector: 'app-criacao-projeto',
  templateUrl: './criacao-projeto.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./criacao-projeto.component.css']
})
export class CriacaoProjetoComponent {
  navbarData = navbarData;
}
