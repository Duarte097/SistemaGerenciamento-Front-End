import { CookieService } from 'ngx-cookie-service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { navbarData } from './nav-data';

interface SideNavToggle {
    screenWidth: number;
    collapsed: boolean;
}
@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.css']
})
export class ToolbarNavigationComponent implements OnInit{
  constructor(private cookie: CookieService, private router: Router){}
  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;


  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }
  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }
  handleLogout(): void {
    this.cookie.delete('USER_INFO');
    this.router.navigate(['/login']);
  }
}
