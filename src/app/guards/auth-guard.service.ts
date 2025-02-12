import { Injectable } from "@angular/core";
import { UserService } from "../service/user/User.service";
import { Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {
  constructor(private userService: UserService, private router: Router){}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

      if(!this.userService.isLoggedIn()){
        this.router.navigate(['/home']);
        return false;
      }

      this.userService.isLoggedIn();
      return true;
    }
}
