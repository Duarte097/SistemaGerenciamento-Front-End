import { Component, Input, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { userItems } from './header-dummy-data';
import { CommonModule } from '@angular/common';
import { CdkMenuModule } from '@angular/cdk/menu';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from 'src/app/service/tasks/search.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, CdkMenuModule, FormsModule],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  @Output() searchSubmitted = new EventEmitter<string>();
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  public searchTerm: string = '';

  canShowSearchAsOverlay = false;
  userItems = userItems;

  constructor(private searchService: SearchService, private cookie: CookieService, private router: Router){}

  @HostListener('window:riseze', ['$event'])
  onResize(event: any){
    this.checkCanShowSearchAsOverlay(event.target.innerWidth);
  }

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }


  handleUserItemClick(item: any): void {
    if (item.click === 'logout') {
      this.handleLogout();
    }
    // Adicione outras ações aqui, se necessário
  }

  handleLogout(): void {
    this.cookie.delete('USER_INFO');
    this.router.navigate(['/login']);
  }

  getHeadClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'header-trimmed';
    }else {
      styleClass = 'header-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearchAsOverlay(innerWidth: number): void {
    if(innerWidth < 845){
      this.canShowSearchAsOverlay = true;
    }else {
      this.canShowSearchAsOverlay = false;
    }
  }

  submitSearch() {
    this.searchService.setSearchTerm(this.searchTerm);
  }

  onSearchTermChange() {
    this.searchService.setSearchTerm(this.searchTerm);
  }
}
