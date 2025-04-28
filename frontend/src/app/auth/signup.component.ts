import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
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


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
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
