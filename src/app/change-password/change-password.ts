
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePassword {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  messageColor: string = 'red';

  constructor(private http: HttpClient) {}

  onChangePassword() {
    const payload = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.http.post('http://127.0.0.1:8000/api/change-password', payload)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.message = res.message;
            this.messageColor = 'green';
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
          } else {
            this.message = res.message;
            this.messageColor = 'red';
          }
        },
        error: (err) => {
          this.message = err.error?.message || 'Failed to change password.';
          this.messageColor = 'red';
        }
      });
  }
}
