import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './student-profile.html',
  styleUrls: ['./student-profile.css']
})

export class StudentProfile {
  student: any = {
    profilePic: 'assets/default-profile.png',
    name: 'John Doe',
    department: 'Computer Science',
    email: 'john.doe@university.edu',
    status: 'Enrolled'
  };

  selectedFile: File | null = null;
  token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      alert('No token found. Please log in.');
    } else {
      this.loadProfile();
    }
  }

  loadProfile() {
    if (!this.token) return;

    this.http.get('http://127.0.0.1:8000/api/student/profile', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    }).subscribe(
      (res: any) => {
      if (res.success) {
        this.student = {
          profilePic: res.student.profile_picture || 'assets/default-profile.png',
          name: res.student.name,
          department: res.student.department,
          registrationNo: res.student.registrationNo || res.student.studentId,
          email: res.student.email,
          badge: res.student.badge || res.student.batch,
          status: res.student.status
        };
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

  uploadProfilePic() {
    const fileInput = document.getElementById('upload-profile-pic') as HTMLInputElement;
    fileInput.click();
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

        this.http.post('http://127.0.0.1:8000/api/student/profile/picture', formData, {
        headers: { 'Authorization': `Bearer ${this.token}` }
        }).subscribe(
        (res: any) => {
            if (res.success) {
            // Add cache-busting parameter to force image reload
            this.student.profilePic = res.profile_picture + '?t=' + new Date().getTime();
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
}