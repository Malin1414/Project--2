import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './staff-info.html',
  styleUrls: ['./staff-info.css']
})
export class StaffInfo implements OnInit {
  staffId = '';
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const storedStaffId = sessionStorage.getItem('staffId');
    if (!storedStaffId) {
      alert('Access denied. Please enroll first.');
      this.router.navigate(['/enroll']);
      return;
    }
    this.staffId = storedStaffId; // fill hidden input
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const staffData = {
      staffId: this.staffId,
      name: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    this.http.post<any>('http://127.0.0.1:8000/api/staff-register', staffData)
      .subscribe({
        next: (res) => {
          alert(res.message);
          if (res.redirect) {
            sessionStorage.removeItem('staffId');
            this.router.navigate([res.redirect]);
          }
        },
        error: (err) => {
          alert(err.error.message || 'Registration failed');
        }
      });
  }
}