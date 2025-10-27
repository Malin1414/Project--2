
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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadNotices();
  }

  loadNotices() {
    this.http.post<any>('http://localhost:8000/api/notices/get', {})
      .subscribe(response => {
        if (response.success) {
          this.notices = response.notices;
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
