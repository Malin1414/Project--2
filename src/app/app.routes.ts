
import { Routes } from '@angular/router';
import { AddNotice } from './add-notice/add-notice';
import { Login } from './login/login';
import { StudentHome } from './student-home/student-home';
import { StaffHome } from './staff-home/staff-home';
import { StudentProfile } from './student-profile/student-profile';
import { StaffProfile } from './staff-profile/staff-profile';
import { ChangePassword } from './change-password/change-password';
import { Enroll } from './enroll/enroll';
import { StaffInfo } from './staff-info/staff-info';
import { StudentInfo } from './student-info/student-info';

export const routes: Routes = [
	{ path: '',  component: Login },
	{ path: 'login', component: Login },
	{ path: 'student-home', component: StudentHome },
	{ path: 'staff-home', component: StaffHome },
	{ path: 'student-profile', component: StudentProfile },
	{ path: 'staff-profile', component: StaffProfile },
	{ path: 'add-notice', component: AddNotice },
	{ path: 'change-password', component: ChangePassword },
	{ path: 'enroll', component: Enroll },
	{ path: 'staff-info', component: StaffInfo },
	{ path: 'student-info', component: StudentInfo},
	{ path: '**', redirectTo: '' }
];
