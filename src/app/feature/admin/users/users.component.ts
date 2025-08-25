import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../../core/service/user.service';
import { UserResponse } from '../../../core/model/auth.models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];
  isLoading = false;
  searchTerm = '';
  statusFilter = 'all';
  sortBy = 'name';

  constructor(
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users.filter(user => user.userType === 'CLIENT');
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  filterUsers() {
    let filtered = [...this.users];
    
    if (this.searchTerm) {
      filtered = filtered.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.company && user.company.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
    
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        this.statusFilter === 'active' ? user.active : !user.active
      );
    }
    
    this.filteredUsers = filtered;
    this.sortUsers();
  }

  sortUsers() {
    this.filteredUsers.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        default:
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  toggleUserStatus(user: UserResponse) {
    this.userService.toggleUserStatus(user.id).subscribe(updatedUser => {
      user.active = updatedUser.active;
    });
  }

  contactWhatsApp(phone: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    window.open(whatsappUrl, '_blank');
  }
}