import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './staff-profile.html',
  styleUrls: ['./staff-profile.css']
})
export class StaffProfile {
  staff: any = {
    profilePic: 'assets/default-profile.png',
    name: '',
    email: '',
    id: '',
    status: ''
  };

  selectedFile: File | null = null;
  token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      alert('No token found. Please log in.');
      window.location.href = '/login';
    } else {
      this.loadProfile();
    }
  }

  loadProfile() {
    if (!this.token) return;

    this.http.get('http://127.0.0.1:8000/api/staff/profile', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    }).subscribe(
      (res: any) => {
        if (res.success) {
          this.staff = {
            profilePic: res.staff.profile_picture || 'assets/default-profile.png',
            name: res.staff.name,
            email: res.staff.email,
            id: res.staff.id || res.staff.staffId,
            status: res.staff.status
          };
        } else {
          alert(res.message || 'Failed to load staff profile1');
        }
      },
      err => {
        console.error(err);
        alert('Failed to load staff profile2');
      }
    );
  }

  onProfilePicChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const formData = new FormData();
      formData.append('profile_picture', this.selectedFile);

      if (!this.token) {
        alert('No token found. Please log in.');
        return;
      }

      this.http.post('http://127.0.0.1:8000/api/staff/profile/picture', formData, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }).subscribe(
        (res: any) => {
          if (res.success) {
            // Cache-busting for instant image refresh
            this.staff.profilePic = res.profile_picture + '?t=' + new Date().getTime();
            alert(res.message);
          } else {
            alert(res.message);
          }
        },
        err => {
          console.error(err);
          alert('Failed to upload profile picture');
        }
      );
    }
  }
  uploadProfilePic() {
    const fileInput = document.getElementById('upload-profile-pic') as HTMLInputElement;
    fileInput.click();
  }
}
