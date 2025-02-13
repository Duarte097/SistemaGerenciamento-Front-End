import { UserService } from '../../../service/user/User.service';
import { Component, OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy{
  private destroy$ = new Subject<void>();
  /*loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });*/

  constructor(
    //private formBuilder: FormBuilder,
    private userService : UserService,
    private cookieService: CookieService,
    //private messageService: MessageService
    private router: Router
  ) {}

  onSubmitLoginForm(): void {
    /*if(this.loginForm.value && this.loginForm.valid){
      this.signupService
      .sinignUser(this.loginForm.value as SignupUserRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response) {
            this.cookieService.set('USER_INFO', response?.token);

            this.loginForm.reset();
            this.router.navigate(['/dashboard']);

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Seja Bem Vindo ${response?.name}!',
              life: 2000,

            })
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao fazer o login!',
            life: 2000,
          })
          console.log(err),
        }
      })
    }*/
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
