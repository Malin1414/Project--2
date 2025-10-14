import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-profile.html',
  styleUrls: ['./staff-profile.css']
})
export class StaffProfile implements OnInit {
  staff = {
    name: 'Dr. Jane Smith',
    email: 'jane.smith@university.edu',
    id: 'fc122252',
    status: 'Enrolled',
    profile_picture: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const staffId = sessionStorage.getItem('staffId');
    if (!staffId) {
      alert('Please login first.');
      window.location.href = '/login';
      return;
    }

    // Fetch staff profile from backend
    this.http.get<any>('http://127.0.0.1:8000/api/staff-profile')
      .subscribe({
        next: res => this.staff = res.staff,
        error: err => alert(err.error?.error || 'Failed to load profile')
      });
  }

  changeProfilePic() {
    const fileInput = document.getElementById('upload-profile-pic') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  uploadProfilePic(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    this.http.post<any>('http://127.0.0.1:8000/api/staff-profile-picture', formData)
      .subscribe({
        next: res => {
          alert(res.message);
          this.staff.profile_picture = res.profile_picture;
        },
        error: err => alert(err.error?.error || 'Upload failed')
      });
  }
}
