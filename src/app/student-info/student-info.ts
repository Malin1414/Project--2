import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule  } from '@angular/common/http';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './student-info.html',
  styleUrls: ['./student-info.css']
}) 

export class StudentInfo {
  student = {
    studentId: sessionStorage.getItem('studentId') || '',
    name: '',
    departmentId: '',
    batchId: '',
    email: '',
    password: '',
    confirm: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.student.password !== this.student.confirm) {
      alert('Passwords do not match!');
      return;
    }

    this.http.post<any>('http://127.0.0.1:8000/api/student-register', this.student)
      .subscribe({
        next: (res) => {
          alert(res.message);
          if (res.redirect) {
            sessionStorage.removeItem('studentId');
            this.router.navigate([res.redirect]);
          }
        },
        error: (err) => {
          alert(err.error.message || 'Registration failed');
        }
      });
  }
}

