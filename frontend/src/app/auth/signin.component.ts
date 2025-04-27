import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signin.component.html',
})
export class SigninComponent implements OnInit {
  myFormIn!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.myFormIn = this.fb.group({
      emailTS: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+'),
        ]),
      ],
      passwordTS: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          this.minusculofValidator,
        ]),
      ],
    });
  }

  minusculofValidator(control: AbstractControl) {
    const pass = control.value as string;
    if (pass !== pass?.toLowerCase() && pass !== null) {
      return { minusculof: true };
    } else return null;
  }

  onSubmit() {
    if (this.myFormIn.valid) {
      const credentials = {
        email: this.myFormIn.value.emailTS,
        password: this.myFormIn.value.passwordTS,
      };

      this.authService.login(credentials).subscribe(
        (response) => {
          console.log('Login bem-sucedido!', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', response.email);

          this.router.navigate(['/mensagens']);
        },
        (error) => {
          this.errorMessage = error.error?.message || 'Erro ao fazer login.';
          console.error('Erro ao fazer login:', error);

          setTimeout(() => {
            this.errorMessage = null;
          }, 5000); // limpa depois de 5 segundos
        }
      );
    }
  }
}
