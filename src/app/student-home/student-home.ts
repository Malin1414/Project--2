import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css']
})

export class StudentHome implements OnInit {
  notices: any[] = [];
  studentProfile: any = {};

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadProfile();
    this.loadNotices();
  }

  loadProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login.');
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any>('http://127.0.0.1:8000/api/student/home/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe(
      res => {
        if (res.success) {
          this.studentProfile = res.student;
        } else {
          alert(res.message);
        }
      },
      err => {
        console.error(err);
        alert('Failed to load student profile');
      }
    );
  }

  loadNotices() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('No token found. Please login.');
    this.router.navigate(['/login']);
    return;
  }

  this.http.get<any>('http://127.0.0.1:8000/api/student/notices', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).subscribe(
    res => {
      if (res.success) {
        // Dynamic notices loaded from backend
        this.notices = res.notices;
      } else {
        // Fallback to hardcoded notices
        console.warn('Failed to load dynamic notices, using fallback');
        this.loadFallbackNotices();
      }
    },
    err => {
      console.error('Error loading notices:', err);
      // Fallback to hardcoded notices
      this.loadFallbackNotices();
    }
  );
}

loadFallbackNotices() {
  this.notices = [
    { date: '23-May-2025', text: 'The Faculty of Urban and Aquatic Bioresource held its orientation program for the new student intake on May 21, 2025, at the faculty premises.' },
    { date: '01-Jun-2025', text: 'Notice 2' },
    { date: '11-Jun-2025', text: 'Notice 3' },
    // ... rest of hardcoded notices
  ];
}


  updateProfilePicture(event: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login.');
      this.router.navigate(['/login']);
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    this.http.post<any>('http://127.0.0.1:8000/api/student/home/profile/picture', formData, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe(
      res => {
        if (res.success) {
          this.studentProfile.profile_picture = res.profile_picture;
          alert(res.message);
        } else {
          alert(res.message);
        }
      },
      err => {
        console.error(err);
        alert('Failed to update profile picture');
      }
    );
  }

  scrollToFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  }
}