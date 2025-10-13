
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-staff-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './staff-info.html',
  styleUrls: ['./staff-info.css']
})
export class StaffInfo {
  staffId = '';
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Normally you would call an Angular service to send this data to your backend
    console.log({
      staffId: this.staffId,
      name: this.name,
      email: this.email,
      password: this.password
    });

    alert('Registration successful!');
  }
}
