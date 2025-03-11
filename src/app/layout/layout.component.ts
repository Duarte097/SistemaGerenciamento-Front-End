import { Component } from '@angular/core';
import { navbarData } from '../modules/toolbar-navigation/nav-data';
import { SearchService } from '../service/tasks/search.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  navData = navbarData;

  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(private searchService: SearchService) {}

  onToggleSideNav(data: SideNavToggle): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  onSearchSubmitted(searchTerm: string): void {
    this.searchService.setSearchTerm(searchTerm); // Usa o SearchService para definir o searchTerm
  }

}
