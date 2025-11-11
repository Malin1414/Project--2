
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class Login {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    if (!this.username || !this.password) {
      alert('Please enter both username and password');
      return;
    }

    const loginData = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://127.0.0.1:8000/api/login', loginData)
      .subscribe({
        next: (res) => {
          if (res.success) {
            // Login successful
            sessionStorage.setItem('token', res.token);
            sessionStorage.setItem('user_id', res.user_id);
            sessionStorage.setItem('user_type', res.user_type);
            
            alert(res.message);
            this.router.navigate([res.redirect]);
          } else {
            // Show error message 
            alert(res.message);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Login failed. Please try again.');
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


