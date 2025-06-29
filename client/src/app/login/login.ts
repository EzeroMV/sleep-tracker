import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  user: User = { userName: '', userPassword: '', email: '' };
  errorMessage: string | null = null;

  constructor(private apiService: ApiService, private router: Router) { }

  login(): void {
    this.apiService.loginUser(this.user).subscribe({
      next: () => {
        this.router.navigate(['/sleep-sessions'], {
          queryParams: { user: this.user.userName }
        });
      },
      error: () => {
        this.errorMessage = 'Неверное имя пользователя или пароль';
      }
    });
  }
}
