import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-info.html',
  styleUrls: ['./student-info.css']
})
export class StudentInfo {
  student = {
    studentId: '',
    name: '',
    departmentId: '',
    batchId: '',
    email: '',
    password: '',
    confirm: ''
  };

  onSubmit() {
    if (this.student.password !== this.student.confirm) {
      alert('Passwords do not match!');
      return;
    }

    // For now, just log to console. Later you can integrate API.
    console.log('Student Registered:', this.student);
    alert('Registration successful!');

    // Optionally, navigate to student home page
    // this.router.navigate(['/student-home']);
  }
}
