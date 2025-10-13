
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePassword {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  messageColor: string = 'red';

  onChangePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'New passwords do not match.';
      this.messageColor = 'red';
    } else {
      this.message = 'Password changed successfully (demo only).';
      this.messageColor = 'green';

      // Clear fields if needed
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }
}
