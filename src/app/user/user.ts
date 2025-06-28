import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  newUser: User = { userName: '', userPassword: '', email: '' };
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (users) => (this.users = users),
      error: (err) => (this.errorMessage = err.message),
    });
  }

  createUser(): void {
    this.apiService.createUser(this.newUser).subscribe({
      next: () => {
        this.loadUsers();
        this.newUser = { userName: '', userPassword: '', email: '' };
        this.errorMessage = null;
      },
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
    window.location.href = `/sleep-sessions?user=${encodeURIComponent(username)}`;
    ;
  }
}