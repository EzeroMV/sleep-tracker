import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  user: User = { userName: '', userPassword: '', email: '' };
  errorMessage: string | null = null;

  constructor(private apiService: ApiService, private router: Router) { }

  register(): void {
    this.apiService.createUser(this.user).subscribe({
      next: () => {
        alert('Регистрация прошла успешно!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}