
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css']
})
export class StudentHome {
  notices = [
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
}
