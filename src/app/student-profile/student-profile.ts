import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-profile.html',
  styleUrls: ['./student-profile.css']
})
export class StudentProfile {
  student: any = {
    profilePic: 'assets/default-profile.png',
    name: '',
    department: '',
    registrationNo: '',
    email: '',
    indexNo: '',
    status: ''
  };

  selectedFile: File | null = null;

  constructor(private http: HttpClient) {
    this.loadProfile();
  }

  loadProfile() {
    this.http.get('http://127.0.0.1:8000/api/student/profile')
      .subscribe((res: any) => {
        if (res.success) {
          this.student = {
            ...this.student,
            ...res.student,
            profilePic: res.student.profile_picture || 'assets/default-profile.png'
          };
        }
      });
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

      this.http.post('http://127.0.0.1:8000/api/student/profile/picture', formData)
        .subscribe((res: any) => {
          if (res.success) {
            this.student.profilePic = res.profile_picture;
            alert(res.message);
          } else {
            alert(res.message);
          }
        });
    }
  }
}
