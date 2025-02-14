import { SignupUserRequest } from '../../models/interfaces/user/SignupUserRequest';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/user/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/AuthResponse';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { environment } from 'src/app/environment/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private cookie: CookieService) {}
  signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse>{
    return this.http.post<SignupUserResponse>(`${this.API_URL}/resgister`, requestDatas);
  }

  authUser(requestDatas:AuthRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, requestDatas);
  }

  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookie.get('USER_INFO');
    return JWT_TOKEN ? true : false;
  }
}
