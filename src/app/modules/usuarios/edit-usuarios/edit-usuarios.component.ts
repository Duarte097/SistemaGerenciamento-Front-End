import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { EditUserRequest } from 'src/app/models/interfaces/user/EditUserRequest';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse';
import { UserService } from 'src/app/service/user/User.service';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';

@Component({
  selector: 'app-edit-usuarios',
  templateUrl: './edit-usuarios.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    ToastModule
  ],
  styleUrls: ['./edit-usuarios.component.css']
})
export class EditUsuariosComponent {
private readonly destroy$: Subject<void> = new Subject();
  public userList: Array<GetAllUsersResponse> = [];
  @Output() closeModalEdit = new EventEmitter<void>();
  @Input() userId: number | null = null;
  public projectData: any = {
    usuarioResponsavel: {
      id_usuarios: null,
      nome: null
    }
  };
  public userData: any = {};
  editUserForm : FormGroup;
  selectedStatus: any;
  selectedUsuarios: any;
  selectedPrioridade: any;
  perfil: any[] = [];
  usuarios: any[] = [];


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
      perfil: ['', Validators.required],
    });
    this.userData ;
  }

  ngOnInit(): void {
    this.perfil = [
      { name: 'USUARIO', code: 'USUARIO' },
      { name: 'ADMIN', code: 'ADMIN' },
    ];
    if (this.userId) {
      this.loadProjectData();
    }else {
      console.log('Nenhum ID de projeto fornecido.');
    }
    console.log("ID do usuário:", this.projectData.usuarioResponsavel.id_usuarios);
  }


  close() {
    this.closeModalEdit.emit();  // Emite um evento para o componente pai fechar o modal
  }



  onSubmit(): void {
    console.log('Formulário enviado', this.editUserForm .value);
    if (this.editUserForm .valid && this.userId) {
      const usersData: EditUserRequest = {
        nome: this.editUserForm .value.nome,
        email: this.editUserForm .value.email,
        senha: this.editUserForm .value.senha,
        perfil: this.editUserForm .value.perfil
      };
      console.log('Chamando tasksServices.createTask...');
      this.userServices.editUser(usersData, this.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.close();
            console.log('Chamando messageService.add() com sucesso...');
            console.log('Mensagem de sucesso:', {
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Projeto editado com sucesso!',
              life: 2000
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Projeto editado com sucesso!',
              life: 2000
            });

          },
          error: (err) => {
            console.log('Chamando messageService.add() com erro...');
            console.log('Mensagem de erro:', {
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar o projeto!',
              life: 2000
            });
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar o projeto!',
              life: 2000
            });
          }
        }
      );
    }
  }

  loadProjectData() {
    console.log('Carregando projeto com ID:', this.userId);
    this.userServices.getUsersById(this.userId ?? 0).subscribe({
      next: (data) => {
        console.log('Dados do projeto recebidos:', data);
        this.userData = data;
      },
      error: (err) => {
        console.error('Erro ao carregar projeto:', err);
      }
    });
  }
}
