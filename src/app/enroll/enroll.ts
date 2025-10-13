
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enroll.html',
  styleUrls: ['./enroll.css']
})
export class Enroll {
  username: string = '';
  password: string = '';

  onEnroll() {
    console.log('Enrolling:', this.username, this.password);
    alert(`User ${this.username} enrolled successfully!`);
  }
}
