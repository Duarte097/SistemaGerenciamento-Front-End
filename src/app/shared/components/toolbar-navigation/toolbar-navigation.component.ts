import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.css']
})
export class ToolbarNavigationComponent {
  constructor(private cookie: CookieService, private router: Router){}

  handleLogout(): void {
    this.cookie.delete('USER_INFO');
    this.router.navigate(['/login']);
  }
}
