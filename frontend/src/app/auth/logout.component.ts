import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: `<div class="col-md-8 col md-ofset-2">
    <button class="btn btn-danger" (click)="onLogout()">Sair</button>
  </div>`,
})
export class LogoutComponent {
  constructor(private router: Router, private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/mensagens']);
  }
}
