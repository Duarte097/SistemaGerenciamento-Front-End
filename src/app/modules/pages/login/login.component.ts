import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../../service/user/login.service';
import { LoginDatas } from 'src/app/models/interfaces/Login';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  constructor(private loginService: LoginService, private router: Router){}

  initialNome = 'Leonardo';
  loginDatas!: LoginDatas;

  ngOnInit(): void {
    this.getLoginDatas(this.initialNome);
  }

  getLoginDatas(nome: string): void {

    this.loginService.getLoginDatas(nome)
    .pipe(
      takeUntil(this.destroy$)
    ).subscribe({next:(response) => {
      response && (this.loginDatas = response);
      console.log(this.loginDatas.username);
    }, error:(error) => {
      console.log(error);
    }
    });
  }

  onSubmit(): void {
    //this.getLoginDatas(this.initialNome);
    //this.initialNome = '';
    this.router.navigate(['/home']);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
