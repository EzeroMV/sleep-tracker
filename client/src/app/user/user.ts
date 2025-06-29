import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class UserComponent implements OnInit {
  users: User[] = [];
  errorMessage: string | null = null;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (users) => (this.users = users),
      error: (err) => (this.errorMessage = err.message),
    });
  }

  deleteUser(username: string): void {
    this.apiService.deleteUser(username).subscribe({
      next: () => this.loadUsers(),
      error: (err) => (this.errorMessage = err.message),
    });
  }

  goToSessions(username: string): void {
    this.router.navigate(['/sleep-sessions'], {
      queryParams: { user: username }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
