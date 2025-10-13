import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-home',
  standalone: true,
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css']
})
export class StudentHome implements OnInit {
  notices: any[] = [];
  studentProfile: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProfile();
    this.loadNotices();
  }

  loadProfile() {
    this.http.get<any>('http://127.0.0.1:8000/api/student-profile')
      .subscribe(res => {
        if (res.success) {
          this.studentProfile = res.student;
        }
      });
  }

  loadNotices() {
    // Replace with actual API if notices are dynamic
    this.notices = [
      { date: '23-May-2025', text: 'The Faculty of Urban and Aquatic Bioresource held its orientation program for the new student intake on May 21, 2025, at the faculty premises.' },
      { date: '01-Jun-2025', text: 'Notice 2' },
      { date: '11-Jun-2025', text: 'Notice 3' },
      // ... rest of notices
    ];
  }

  updateProfilePicture(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    this.http.post<any>('http://127.0.0.1:8000/api/student-profile/update-picture', formData)
      .subscribe(res => {
        if (res.success) {
          this.studentProfile.profile_picture = res.profile_picture;
        } else {
          alert(res.message);
        }
      });
  }
}
