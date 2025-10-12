import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-profile.html',
  styleUrls: ['./staff-profile.css']
})
export class StaffProfile {
  staff = {
    name: 'Dr. Jane Smith',
    email: 'jane.smith@university.edu',
    id: 'fc122252',
    status: 'Enrolled'
  };

  changeProfilePic() {
    const fileInput = document.getElementById('upload-profile-pic') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }
}
