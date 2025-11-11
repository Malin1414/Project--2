import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-enroll',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './enroll.html',
  styleUrls: ['./enroll.css']
})
export class Enroll {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onEnroll() {
    if (!this.username || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    this.http.post<any>('http://127.0.0.1:8000/api/enroll', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          alert(res.message);
          
          if (res.user_type === 'student') {
            sessionStorage.setItem('studentId', res.user_id);
            this.router.navigate(['/student-info']);
          } else if (res.user_type === 'staff') {
            sessionStorage.setItem('staffId', res.user_id);
            this.router.navigate(['/staff-info']);
          }
        } else {
          alert(res.message);
          if (res.redirect === 'login') {
            this.router.navigate(['/login']);
          }
        }
      },
      error: (err) => {
        console.error('Enrollment error:', err);
        alert(err.error?.message || 'Enrollment failed. Please try again.');
      }
    });
  }

  scrollToFooter() {
  const footer = document.getElementById('footer');
  if (footer) {
    footer.scrollIntoView({ behavior: 'smooth' });
  }
}

}