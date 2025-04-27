import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterModule,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent {}
