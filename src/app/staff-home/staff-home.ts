
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadNotices();
  }

  loadNotices() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login.');
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any>('http://127.0.0.1:8000/api/staff/home/notices', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        if (res.success && res.notices && res.notices.length > 0) {
          this.notices = res.notices;
        } else {
          console.warn('No notices found. Using default.');
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
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<any>('http://127.0.0.1:8000/api/departments-batches', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe(response => {
      if (response.success) {
        this.departments = response.departments;
        this.batches = response.batches;
      }
    });
  }

  updateNotice() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.post<any>('http://127.0.0.1:8000/api/staff/home/notice/update', this.editingNotice, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe(response => {
      if (response.success) {
        alert('Notice updated successfully');
        this.loadNotices();
        this.closeEditModal();
      } else {
        alert(response.message);
      }
    });
  }

  deleteNotice(notice: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login.');
      this.router.navigate(['/login']);
      return;
    }

    if (!confirm('Are you sure you want to delete this notice?')) return;

    const payload = { noticeId: notice.noticeId };

    this.http.post<any>('http://127.0.0.1:8000/api/staff/home/notice/delete', payload, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe(
      res => {
        if (res.success) {
          alert('Notice deleted successfully');
          this.notices = this.notices.filter(n => n !== notice);
        } else {
          alert(res.message);
        }
      },
      err => {
        console.error('Delete failed:', err);
        alert('Failed to delete notice');
      }
    );
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingNotice = null;
  }

  scrollToFooter() {
  const footer = document.getElementById('footer');
  if (footer) {
    footer.scrollIntoView({ behavior: 'smooth' });
  }
}

}
