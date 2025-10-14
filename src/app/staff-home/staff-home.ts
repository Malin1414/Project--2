import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-staff-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-home.html',
  styleUrls: ['./staff-home.css']
})

export class StaffHome implements OnInit {
  notices: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadNotices();
  }

  loadNotices() {
    this.http.get<any>('http://127.0.0.1:8000/api/staff-notices')
      .subscribe(res => {
        if (res.success) this.notices = res.notices;
      });
  }

  deleteNotice(notice: any) {
    const payload = { noticeId: notice.noticeId };
    this.http.post<any>('http://127.0.0.1:8000/api/staff-notices/delete', payload)
      .subscribe(res => {
        if (res.success) this.notices = this.notices.filter(n => n !== notice);
      });
  }
}
