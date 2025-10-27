
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './staff-home.html',
  styleUrls: ['./staff-home.css']
})

export class StaffHome implements OnInit {
  notices: any[] = [];
  showEditModal: boolean = false;
  editingNotice: any = null;
  departments: any[] = [];
  batches: any[] = [];

  defaultNotices = [
    { date: '23-May-2025', text: 'The Faculty of Urban and Aquatic Bioresource held its orientation program for the new student intake on May 21, 2025, at the faculty premises.' },
    { date: '01-Jun-2025', text: 'Notice 2' },
    { date: '11-Jun-2025', text: 'Notice 3' },
    { date: '18-Jun-2025', text: 'Notice 4' },
    { date: '21-Jun-2025', text: 'Notice 5' },
    { date: '22-Jun-2025', text: 'Notice 6' },
    { date: '26-Jun-2025', text: 'Notice 7' },
    { date: '02-Jul-2025', text: 'Notice 8' },
    { date: '08-Jul-2025', text: 'Notice 9' },
    { date: '10-Jul-2025', text: 'Notice 10' },
    { date: '12-Jul-2025', text: 'Notice 11' },
    { date: '15-Jul-2025', text: 'Notice 12' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadNotices();
  }

  loadNotices() {
    this.http.post<any>('http://localhost:8000/api/notices/get', {})
      .subscribe({
        next: (response) => {
          if (response.success && response.notices && response.notices.length > 0) {
           this.notices = response.notices;
          } else {
            this.notices = this.defaultNotices;
          }
        },
        error: (err) => {
          console.error('Error loading notices:', err);
          this.notices = this.defaultNotices;
        }
      });
  }
  
  editNotice(notice: any) {
    this.editingNotice = { ...notice };
    this.loadDepartmentsAndBatches();
    this.showEditModal = true;
  }

  loadDepartmentsAndBatches() {
    this.http.post<any>('http://localhost:8000/api/departments-batches', {})
      .subscribe(response => {
        if (response.success) {
          this.departments = response.departments;
          this.batches = response.batches;
        }
      });
  }

  updateNotice() {
    this.http.post<any>('http://localhost:8000/api/notices/update', this.editingNotice)
      .subscribe(response => {
        if (response.success) {
          this.loadNotices();
          this.closeEditModal();
        }
      });
  }

  deleteNotice(notice: any) {
    const payload = { noticeId: notice.noticeId };
    this.http.post<any>('http://127.0.0.1:8000/api/staff-notices/delete', payload)
      .subscribe(res => {
        if (res.success) this.notices = this.notices.filter(n => n !== notice);
      });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingNotice = null;
  }
}
