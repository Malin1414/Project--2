import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-profile.html',
  styleUrls: ['./student-profile.css']
})
export class StudentProfile {
  student = {
    profilePic: 'assets/default-profile.png', // default profile image
    name: 'John Doe',
    department: 'Computer Science',
    registrationNo: 'CS20231001',
    email: 'john.doe@university.edu',
    indexNo: '15001001',
    status: 'Enrolled'
  };

  uploadProfilePic() {
    const fileInput = document.getElementById('upload-profile-pic') as HTMLInputElement;
    fileInput.click();
  }

  onProfilePicChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.student.profilePic = e.target.result;
      reader.readAsDataURL(input.files[0]);
    }
  }
}
