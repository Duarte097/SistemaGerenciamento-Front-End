import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { UserService } from 'src/app/service/user/User.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { EditUserRequest } from 'src/app/models/interfaces/user/EditUserRequest';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';
import { CriacaoUsuariosComponent } from "./criacao-usuarios/criacao-usuarios.component";
import { EditUsuariosComponent } from './edit-usuarios/edit-usuarios.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    CriacaoUsuariosComponent,
    EditUsuariosComponent
],
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  private readonly destroy$: Subject<void> = new Subject();
  public userList: GetAllUsersResponse[] = [];
  public allUsers: GetAllUsersResponse[] = [];
  public selectedUserId: number | null = null;
  @Input() userId: number | null = null;

  public userData: any = {};
  editUserForm : FormGroup;
  perfil: any[] = [];
  usuarios: any[] = [];

  public currentPage = 1;
  public pageSize = 5; // Defina o tamanho da página desejado
  public totalItems = 0;


  constructor(
    private formBuilder: FormBuilder,
    private usersDtService: UsersDataTransferService,
    private userServices : UserService,
    private messageService: MessageService,
  ) {
    this.editUserForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.required],
      senha: ['', Validators.required],
      perfil:['', Validators.required]
    });
    this.userData ;
  }

  isModalCreateOpen = false;
  isModalViewOpen = false;
  isModalEditOpen = false;


  ngOnInit(): void {
    this.perfil = [
      { name: 'USUARIO', code: 'USUARIO' },
      { name: 'ADMIN', code: 'ADMIN' },
    ];
    this.getUserIdFromToken();
    if(this.userData.perfil === 'ADMIN') {
     this.loadAllUsersData()
    }
    this.loadAllUsersData()
    if (this.userId) {
      this.loadUsersData();
  } else {
      console.log('Nenhum ID de projeto fornecido.');
    }
  }


  openModalCreate() {
    this.isModalCreateOpen = true;  // Abre o modal
  }

  closeModalCreate() {
    this.isModalCreateOpen = false;  // Fecha o modal
    this.loadUsersData();
  }


  openModalView(userId: number) {
    this.selectedUserId = userId;
    this.isModalViewOpen = true;
    console.log(userId);
  }

  closeModalView() {
    this.isModalViewOpen = false;  // Fecha o modal
  }

  openModalEdit(userId: number) {
    this.selectedUserId = userId;
    this.isModalEditOpen = true;
  }

  closeModalEdit() {
    this.isModalEditOpen = false;
    this.loadUsersData();
  }

  onSubmit(): void {
    console.log('Formulário enviado', this.editUserForm .value);
    if (this.editUserForm .valid && this.userId) {
      const usersData: EditUserRequest = {
        nome: this.editUserForm .value.nome,
        email: this.editUserForm .value.email,
        senha: this.editUserForm .value.senha,
      };
      this.userServices.editUser(usersData, this.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.closeModalCreate();
            console.log('Chamando messageService.add() com sucesso...');
            console.log('Mensagem de sucesso:', {
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuario editado com sucesso!',
              life: 2000
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuario editado com sucesso!',
              life: 2000
            });

          },
          error: (err) => {
            console.log('Chamando messageService.add() com erro...');
            console.log('Mensagem de erro:', {
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar o Usuario!',
              life: 2000
            });
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar o Usuario!',
              life: 2000
            });
          }
        }
      );
    }
  }

  loadUsersData() {
    this.userServices.getUsersById(this.userId ?? 0).subscribe({
      next: (data) => {
        console.log('Dados do Usuario recebidos:', data);
        this.userData = data;
      },
      error: (err) => {
        console.error('Erro ao carregar o Usuario:', err);
      }
    });
  }

  loadAllUsersData() {
    this.userServices
    .getAllUsers()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: GetAllUsersResponse[]) => {
        console.log('Dados dos Usuarios recebidos:', response);
        this.allUsers = response;
        this.totalItems = response.length; // Atualize totalItems aqui
        this.changePage(1)
      },

      error: (err) => {
        console.error('Erro ao carregar os Usuarios:', err);
      }
    });
  }

  getUserIdFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken: any = jwtDecode(token);
            this.userId = decodedToken.sub;
            console.log("ID do usuario extraido do token: ", this.userId);
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
            console.error('Token problemático:', token);
        }
    } else {
        console.error('Token não encontrado no localStorage.');
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.userList = this.allUsers.slice(startIndex, endIndex); // Exiba apenas a página atual
  }

  getPages(): number[] {
      const pageCount = Math.ceil(this.totalItems / this.pageSize);
      return Array(pageCount).fill(0).map((x, i) => i + 1);
  }
}
