import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { navbarData } from './modules/toolbar-navigation/nav-data';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SistemaGerenciamento-Front-End';

  constructor(private primeNgConfig: PrimeNGConfig, private router: Router) {}
  navData = navbarData;

  isSideNavCollapsed = false;
  screenWidth = 0;


  onToggleSideNav(data: SideNavToggle): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  ngOnInit(): void {
    this.primeNgConfig.ripple = true;
  }
}
