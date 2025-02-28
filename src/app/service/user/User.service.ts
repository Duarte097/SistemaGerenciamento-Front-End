import { SignupUserRequest } from '../../models/interfaces/user/SignupUserRequest';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/user/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/AuthResponse';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { environment } from 'src/app/environment/environment';
import { CookieService } from 'ngx-cookie-service';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`
    })
  }

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAllUsers(): Observable<Array<GetAllUsersResponse>>{
    return this.http.get<Array<GetAllUsersResponse>>(
      `${this.API_URL}/users`,
      this.httpOptions
    )
    .pipe(
      map((user) => user.filter((data) => data?.amount > 0))
    );
  }

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
