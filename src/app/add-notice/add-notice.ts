import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-notice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-notice.html',
  styleUrls: ['./add-notice.css']
})
export class AddNotice {
  noticeTitle = '';
  description = '';
  departments: string[] = [];
  batches: string[] = [];
  attachment: File | null = null;

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    this.attachment = event.target.files[0];
  }

  onSubmit() {
    if (!this.noticeTitle || !this.description || this.departments.length === 0 || this.batches.length === 0) {
      alert('Please fill in all required fields and select at least one department and batch.');
      return;
    }

    const formData = new FormData();
    formData.append('noticeTitle', this.noticeTitle);
    formData.append('description', this.description);
    this.departments.forEach(dept => formData.append('departments[]', dept));
    this.batches.forEach(batch => formData.append('batches[]', batch));
    if (this.attachment) formData.append('attachment', this.attachment);

    this.http.post('http://127.0.0.1:8000/api/notices', formData)
      .subscribe({
        next: (res: any) => {
          alert(res.message || 'Notice added successfully!');
          // Optionally navigate to staff home
          // this.router.navigate(['/staff-home']);
        },
        error: err => alert(err.error?.error || 'Failed to submit notice.')
      });
  }

  toggleDepartment(dept: string, event: any) {
    if (event.target.checked) this.departments.push(dept);
    else this.departments = this.departments.filter(d => d !== dept);
  }

  toggleBatch(batch: string, event: any) {
    if (event.target.checked) this.batches.push(batch);
    else this.batches = this.batches.filter(b => b !== batch);
  }
}
