import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.myForm = new FormGroup({
      firstNameTS: new FormControl(null, Validators.required),
      lastNameTS: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(16),
      ]),
      emailTS: new FormControl(null, [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+'),
      ]),
      passwordTS: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    if (this.myForm.invalid) return;

    const user = {
      firstName: this.myForm.value.firstNameTS,
      lastName: this.myForm.value.lastNameTS,
      email: this.myForm.value.emailTS,
      password: this.myForm.value.passwordTS,
    };

    this.authService.register(user).subscribe({
      next: (response) => {
        console.log('Usuário cadastrado!', response);
        this.myForm.reset();

        this.router.navigate(['/autenticacao/signin']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar usuário:', error);
      },
    });
  }
}
