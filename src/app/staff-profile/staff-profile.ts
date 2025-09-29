import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-profile.html',
  styleUrls: ['./staff-profile.css']
})
export class StaffProfile implements AfterViewInit {
  ngAfterViewInit(): void {
    const changePasswordBtn = document.getElementById('change-password-btn') as HTMLButtonElement | null;
    if (changePasswordBtn) {
      changePasswordBtn.addEventListener('click', () => {
        alert('Redirecting to change password page...');
      });
    }

    const changeProfilePicBtn = document.getElementById('change-profile-pic-btn') as HTMLButtonElement | null;
    const uploadProfilePic = document.getElementById('upload-profile-pic') as HTMLInputElement | null;
    const profilePicDiv = document.getElementById('profile-pic') as HTMLDivElement | null;

    if (changeProfilePicBtn && uploadProfilePic && profilePicDiv) {
      changeProfilePicBtn.addEventListener('click', () => uploadProfilePic.click());

      uploadProfilePic.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files ? target.files[0] : null;
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result as string;
            profilePicDiv.style.backgroundImage = `url('${result}')`;
            localStorage.setItem('profilePic', result);
          };
          reader.readAsDataURL(file);
        }
      });

      const savedPic = localStorage.getItem('profilePic');
      if (savedPic) {
        profilePicDiv.style.backgroundImage = `url('${savedPic}')`;
      }
    }
  }
}
