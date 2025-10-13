import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enroll',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './enroll.html',
  styleUrls: ['./enroll.css']
})
export class Enroll {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onEnroll() {
    this.http.post<any>('http://127.0.0.1:8000/api/enroll', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.studentId) {
          sessionStorage.setItem('studentId', res.studentId);
          window.location.href = res.redirect;
        } else if (res.staffId) {
          sessionStorage.setItem('staffId', res.staffId);
          window.location.href = res.redirect;
        }
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }
}