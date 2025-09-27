import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddNotice } from "./add-notice/add-notice";
import { ChangePassword } from "./change-password/change-password";
import { Enroll } from "./enroll/enroll";
import { Login } from "./login/login";
import { StaffHome } from "./staff-home/staff-home";
import { StaffInfo } from "./staff-info/staff-info";
import { StaffProfile } from "./staff-profile/staff-profile";
import { StudentHome } from "./student-home/student-home";
import { StudentInfo } from "./student-info/student-info";
import { StudentProfile } from "./student-profile/student-profile";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AddNotice, ChangePassword, Enroll, Login, StaffHome, StaffInfo, StaffProfile, StudentHome, StudentInfo, StudentProfile],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my Angular-app');
}
